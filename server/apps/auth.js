import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../utils/db.js";

const authRouter = Router();

// 🐨 Todo: Exercise #1
// ให้สร้าง API เพื่อเอาไว้ Register ตัว User แล้วเก็บข้อมูลไว้ใน Database ตามตารางที่ออกแบบไว้
authRouter.post("/register", async (req, res) => {
  try {
    // decode req.body
    const user = {
      username: req.body.username,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    };

    // hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // save to database
    const collection = db.collection("users");
    await collection.insertOne(user);

    // return success
    return res.json({
      message: "User has been created successfully" ,
    });
  } catch (error) {
    // return error
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });    
  }
});

// 🐨 Todo: Exercise #3
// ให้สร้าง API เพื่อเอาไว้ Login ตัว User ตามตารางที่ออกแบบไว้
authRouter.post("/login", async (req, res) => {
  try {
    // decode req.body
    const user = {
      username: req.body.username?.trim().toLowerCase(),
      password: req.body.password,
    };

    // check if username and password is empty
    if (!user.username || !user.password) {
      return res.status(400).json({ message: "Username and password is required" });
    }

    // check if user exists
    const collection = db.collection("users");
    const foundUser = await collection.findOne({ username: user.username });

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // check if password is correct
    const validPassword = await bcrypt.compare(user.password, foundUser.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    
    // create token
    const secretKey = process.env.SECRET_KEY;
    const token = jwt.sign(
      {
        id: foundUser._id,
        username: foundUser.username,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
      },
      secretKey,
      { expiresIn: "1d" }
    );

    // return token
    return res.json({
      message: "login successfully",
      "token": token,
    });
  } catch (error) {
    // return error
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

export default authRouter;
