const db = require("../db");

exports.authMiddleware = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
};

exports.adminMiddleware = (req, res, next) => {
    if (!req.session.userId || req.session.role !== "admin") {
        return res.status(403).json({ error: "Forbidden" });
    }
    next();
};