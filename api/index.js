const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const testRoute = require('./routes/test');
const ticketRoutes = require("./routes/tickets");



const screensRoutes = require("./routes/screens");
const webhookRoutes = require("./routes/webhook");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Mongo connected"))
    .catch((err) => console.error("Mongo error:", err));

// Register routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api", screensRoutes);
app.use("/webhook", webhookRoutes);
app.use("/api", ticketRoutes);

app.use('/api', testRoute);


app.get("/", (req, res) => {
    res.send("Flowbit api is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
