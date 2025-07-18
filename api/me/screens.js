const express = require("express");
const router = express.Router();
const registry = require("../registry.json");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to extract customerId from JWT
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json({ message: "Missing token" });

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.customerId = decoded.customerId;
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid token" });
    }
};

router.get("/me/screens", authMiddleware, (req, res) => {
    const customerId = req.customerId;

    const screens = registry[customerId] || [];

    res.json({ screens });
});

module.exports = router;
