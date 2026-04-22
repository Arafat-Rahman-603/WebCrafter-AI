import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    // First try the httpOnly cookie (works when sameSite:none is set)
    let token = req.cookies.token;

    // Fallback: Authorization: Bearer <token> header (used by frontend localStorage strategy)
    if (!token) {
        const authHeader = req.headers["authorization"];
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
        }

        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error("Error in verifyToken middleware:", error);
        return res.status(401).json({ success: false, message: "Unauthorized - invalid or expired token" });
    }
};
