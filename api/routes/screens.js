const express = require("express");
const router = express.Router();
const registry = require("../registry.json");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

//  Middleware to extract full user from JWT
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json({ message: "Missing token" });

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid token" });
    }
};

// Route to return screens based on tenant and user role
router.get("/me/screens", authMiddleware, (req, res) => {
    try {
        const customerId = req.user.customerId?.trim();
        const userRole = req.user.role;

        console.log(" Getting screens for:", customerId);
        console.log(" Decoded user:", req.user);

        let screens = registry[customerId];

        if (!screens) {
            return res.status(404).json({ message: "No screens found for this customer" });
        }

        // Filter out admin-only screens if user is not the  admin
        if (userRole !== "Admin") {
            screens = screens.filter(screen => screen.url !== "/tickets");
        }

        res.json({ screens });
    } catch (error) {
        console.error(" Error in /me/screens:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
