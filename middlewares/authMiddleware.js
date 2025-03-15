const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

// Protect middleware to ensure only authorized users can access certain routes
const protect = async (req, res, next) => {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];  // Extract the token
       
    } else {
        return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    try {
        // Verify the token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach the user to the request object
        req.user = await User.findById(verified.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        next();  // Proceed to the next middleware or route handler
    } catch (err) {
        console.error("JWT Error:", err.message);
        return res.status(401).json({ message: "Not authorized, invalid token", error: err.message });
    }
};

module.exports = { protect };
