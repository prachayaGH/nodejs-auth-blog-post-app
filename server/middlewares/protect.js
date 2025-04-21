// 🐨 Todo: Exercise #5
// สร้าง Middleware ขึ้นมา 1 อันชื่อ Function ว่า `protect`
// เพื่อเอาไว้ตรวจสอบว่า Client แนบ Token มาใน Header ของ Request หรือไม่

// import jwt
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// setup middleware to protect the routes from unauthenticated users
export const protect = (req, res, next) => {
  // declare token from header
  const token = req.headers.authorization;

  // if no token
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Token has invalid format",
    });
  }

  // get token from header
  const tokenWithoutBearer = token.split(" ")[1];

  // verify token using secret key
  dotenv.config();
  jwt.verify(tokenWithoutBearer, process.env.SECRET_KEY, (err, payload) => {
    if (err) {
      return res.status(401).json({
        message: "Token is invalid",
      });
    }

    // if token is valid save payload to req
    req.user = payload;
    next();
  });
};
