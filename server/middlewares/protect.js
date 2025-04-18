// 🐨 Todo: Exercise #5
// สร้าง Middleware ขึ้นมา 1 อันชื่อ Function ว่า `protect`

function protect(req, res, next) {
    // เพื่อเอาไว้ตรวจสอบว่า Client แนบ Token มาใน Header ของ Request หรือไม่
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({
            message: "No token provided",
        });
    }
    next();
}

export default protect;