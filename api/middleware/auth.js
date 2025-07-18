//so this is basically the middleware file in which it checks the user is authenticated or not
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;


function authMiddleWare(req, res, next) {
    const authHeader = req.header.authorization;

    if (!authHeader?.startWith("Bearer")) {
        return res.status(401).json({
            success: false,
            error: "no token provided"
        });
    }

    const token = authHeader.split(" ")[1];


    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        return res.status(403).json({ error: "Inavlid token" });

    }
}

//restrict to only admins

function adminOnly(req, res, next) {
    if (req.user.role != "Admin") {
        return res.status(403).json({ error: "Admin only" });
    }
    next();
}

module.exports = { authMiddleWare, adminOnly };