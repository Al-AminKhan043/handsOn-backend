const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

const protect = async (req, res, next) => {
    let token;

    

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } else {
        
        return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    try {
        

        // Decode to check if token structure is correct
        const decoded = jwt.decode(token);
        if (!decoded) {
           
            return res.status(401).json({ message: "Invalid token, make sure to login." });
        }
        

        // Verify token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
      

        req.user = await User.findById(verified.id).select("-password");
        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        next();
    } catch (err) {
        console.error("JWT Error:", err.message);
        return res.status(401).json({ message: "Not authorized, invalid token", error: err.message });
    }
};









module.exports = { protect };