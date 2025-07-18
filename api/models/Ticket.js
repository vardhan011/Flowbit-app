const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: {
        type: String,
        default: "Pending",
    },
    customerId: String,
    createdBy: String, // admin
    assignedTo: String, // user@example.com
}, { timestamps: true });


module.exports = mongoose.model("Ticket", TicketSchema);
