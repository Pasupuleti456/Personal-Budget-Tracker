const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const adminUserAuthenticate = async (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const token = authHeader.replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userId = decoded.id || decoded._id;
        const user = await User.findById(userId);

        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admin role required." });
        }

        // Attach the full user object to the request
        req.user = user; 
        next();
    } catch (err) {
        console.error("Token validation error:", err);
        res.status(401).json({ message: "Token is not valid" });
    }
};

module.exports = adminUserAuthenticate;

