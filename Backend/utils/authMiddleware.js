import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const token = authHeader.split(" ")[1];
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            console.error("JWT_SECRET is missing from .env");
            return res.status(500).json({
                message: "Server configuration error"
            });
        }

        const decodedData = jwt.verify(token, jwtSecret);

        if (!decodedData.userId) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        req.userId = decodedData.userId;
        next();

    } catch (err) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

export default authMiddleware;
