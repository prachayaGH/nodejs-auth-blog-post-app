import { Router } from "express";
import bcrypt from "bcrypt";
import { db } from "../utils/db.js";
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';


dotenv.config();
const authRouter = Router();
// 🐨 Todo: Exercise #1
// ให้สร้าง API เพื่อเอาไว้ Register ตัว User แล้วเก็บข้อมูลไว้ใน Database ตามตารางที่ออกแบบไว้
// รับ ข้อมูลจาก Body ของ Request
authRouter.post("/register", async(req, res) => {
    const user = {
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    }
    // แปลง password โดยใช้ hash
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    // แล้วเก็บข้อมูลลงใน Database
    try {
        const result = await db.collection("users").insertOne(user);
        return res.status(201).json({
            message: "User has been created successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error creating user",
            error: error.message,
        });
    }
})
// 🐨 Todo: Exercise #3
// ให้สร้าง API เพื่อเอาไว้ Login ตัว User ตามตารางที่ออกแบบไว้
authRouter.post("/login", async(req,res) => {
    try {
        // เช็คว่า username ที่ request มานั้นมีอยู่ใน Database หรือไม
        const user = await db.collection("users").findOne({ username: req.body.username });
        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }
        // ถ้ามีให้ทำการเปรียบเทียบ password ที่ส่งมาว่าตรงกับใน Database หรือไม่
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "password not valid",
            });
        }
        // ถ้าตรงให้ทำการสร้าง token โดยใช้ jsonwebtoken
        // มี arguments 3 ตัวคือ payload, secret, options
        // payload คือข้อมูลที่เราต้องการเก็บใน token เช่น id, username, firstName, lastName
        const token = jwt.sign(
            {id: user.id, firstName: user.firstName, lastName: user.lastName},
            process.env.SECRET_KEY,
            { expiresIn: "30" }
        )
        // ส่ง token กลับไปให้ client
        return res.status(200).json({
            message: "Login successful",
            token,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error logging in",
            error: error.message,
        }); 
    }
})
export default authRouter;

