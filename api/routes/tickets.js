const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const jwt = require("jsonwebtoken");
const axios = require("axios");


const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to extract user from token
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Missing token" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid token" });
    }
};

//  Route: POST /api/tickets/create
router.post("/tickets/create", authMiddleware, async (req, res) => {
    if (req.user.role !== "Admin") {
        return res.status(403).json({ message: "Only Admins can create tickets" });
    }

    const { title, description, assignedTo } = req.body;

    const { customerId, email } = req.user;

    try {
        const ticket = new Ticket({
            title,
            description,
            customerId,
            createdBy: email,
            assignedTo,
        });


        await ticket.save();
        console.log("Ticket saved:", ticket);
        // Trigger n8n workflow webhook
        const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || "http://localhost:5678/webhook/ticket-created";

        try {
            await axios.post(n8nWebhookUrl, {
                ticketId: ticket._id,
                customerId: ticket.customerId,
                title: ticket.title,
                status: ticket.status,
            });
            console.log("n8n webhook triggered");
        } catch (webhookError) {
            console.error("Failed to trigger n8n webhook:", webhookError.message);
        }





        res.status(201).json({ message: "Ticket created", ticket });
    } catch (err) {
        console.error("Ticket save error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// GET /api/tickets - Get all tickets Admin only
router.get("/tickets", authMiddleware, async (req, res) => {
    if (req.user.role !== "Admin") {
        return res.status(403).json({ message: "Only Admins can view tickets" });
    }

    const tickets = await Ticket.find({ customerId: req.user.customerId });
    res.json({ tickets });
});
// GET /api/tickets/mine
router.get("/tickets/mine", authMiddleware, async (req, res) => {
    const { role, email, customerId } = req.user;

    let tickets;

    if (role === "Admin") {
        // Admins see all tickets for their tenant
        tickets = await Ticket.find({ customerId });
    } else {
        // Users see only tickets assigned to them
        tickets = await Ticket.find({ customerId, assignedTo: email });
    }

    res.json({ tickets });
});



module.exports = router;
