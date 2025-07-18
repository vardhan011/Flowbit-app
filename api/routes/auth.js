const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


const JWT_SECRET = process.env.JWT_SECRET;

///this route is used for the signup page (newly users)
router.post("/signup", async (req, res) => {
    let { email, password, role, customerId } = req.body;

    // Normalize
    email = email.trim().toLowerCase();
    customerId = customerId.trim().toLowerCase();

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedpassword = await bcrypt.hash(password, 10);
        const user = new User({
            email,
            password: hashedpassword,
            role,
            customerId
        });
        await user.save();
        res.status(201).json({ message: "User created" });

    } catch (e) {
        res.status(400).json({
            message: "Something went wrong while signing up",
            error: e.message
        });
    }
});

router.post("/signin", async (req, res) => {
    console.log("Signin route hit"); // 👈
    const { email, password } = req.body;
    try {

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email"
            })
        }
        //check if th epassword is matching 
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({
            success: false,
            message: "Invalid password"
        });

        //creation of token once the users enteres correct email and password
        const token = jwt.sign
            ({
                email: user.email, role: user.role, customerId: user.customerId
            },
                JWT_SECRET, { expiresIn: "1d" }

            );

        res.json({ token });



    } catch (e) {
        res.status(500).json({
            success: false,
            e: "something went wrong"
        })

    }
})

module.exports = router;