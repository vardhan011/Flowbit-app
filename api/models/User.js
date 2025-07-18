const monogoose = require("mongoose");

const UserScheme = new monogoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ["Admin", "User"],
        default: "User"
    },
    customerId: {
        type: String,
        required: true
    },
});

module.exports = monogoose.model("User", UserScheme);