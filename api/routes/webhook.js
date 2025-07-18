const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket"); // your Mongoose model
require("dotenv").config();

const SHARED_SECRET = process.env.WEBHOOK_SECRET || "mysecret123";

// Webhook to update ticket status
router.post("/webhook/ticket-done", async (req, res) => {
    const secret = req.headers["x-webhook-secret"];
    if (secret !== SHARED_SECRET) {
        return res.status(403).json({ message: "Forbidden: invalid secret" });
    }

    try {
        const { ticketId, status } = req.body;
        if (!ticketId || !status) {
            return res.status(400).json({ message: "Missing ticketId or status" });
        }

        // Update ticket status in DB
        const updatedTicket = await Ticket.findByIdAndUpdate(
            ticketId,
            { status },
            { new: true }
        );

        if (!updatedTicket) {
            return res.status(404).json({ message: "Ticket not found" });
        }


        res.json({ message: "Ticket updated", ticket: updatedTicket });
    } catch (error) {
        console.error("Webhook error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
