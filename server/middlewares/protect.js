import jwt from "jsonwebtoken";
// 🐨 Todo: Exercise #5
// สร้าง Middleware ขึ้นมา 1 อันชื่อ Function ว่า `protect`

function protect(req, res, next) {
    // เพื่อเอาไว้ตรวจสอบว่า Client แนบ Token มาใน Header ของ Request หรือไม่
    const token = req.headers.authorization;
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({
            message: "Token has invalid format",
        });
    }
    const tokenWithoutBearer = token.split(" ")[1];
    try {
        const decode = jwt.verify(tokenWithoutBearer, process.env.SECRET_KEY);
        req.user = decode;
        next();
    } catch (error) {
        return res.status(401).json({   
            message: "Token is invalid",
            error: error.message,
        });

    }
}

export default protect;