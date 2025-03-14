const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const protect= async(req,res,next)=>{
 let token;

 if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
}

if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
}

try {
    console.log("Token received:", token); 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); 
    req.user = await User.findById(decoded.id).select("-password");
    next();
} catch (err) {
    console.error("JWT Error:", err.message); 
    res.status(401).json({ message: "Not authorized, invalid token" });
}

}









module.exports = { protect };