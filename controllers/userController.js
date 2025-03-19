const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
};

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, skills, causes } = req.body;

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match!" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }

        // Create new user
        const user = await User.create({ name, email, password, skills, causes });
        const token = generateToken(user._id); 
        res.status(201).json({
            message: "User registered successfully!",
            token, 
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                skills: user.skills,
                causes: user.causes
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

// Login an existing user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate token using _id but return it as id in the response
        const token = generateToken(user._id);

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,  
                name: user.name,
                email,
                skills: user.skills,
                causes: user.causes
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Error logging in", error: err.message });
    }
};

// Logout a user (clear JWT cookie)
const logoutUser = async (req, res) => {
    try {
        res.cookie('jwt', '', {
            httpOnly: true,
            expires: new Date(0)
        });
        res.status(200).json({ message: 'User logged out successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Error logging out', error: err.message });
    }
};

// Get user profile by id (accepts either _id or id)
const getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id.trim();

        // Query with both _id and id
        const user = await User.findOne({ $or: [{ _id: userId }, { id: userId }] }).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user profile.', error: err.message });
    }
};

// Delete user by id
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user.', error: err.message });
    }
};

// Update user by id (allows updating skills and causes)
const updateUser = async (req, res) => {
    try {
        const { name, email, skills, causes } = req.body;

        // Check if the user is authorized to update this profile
        if (req.user.id !== req.params.id) {
            return res.status(403).json({ message: "You are not authorized to update this account." });
        }

        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Validate skills and causes fields
        if (skills && !Array.isArray(skills)) {
            return res.status(400).json({ message: "Skills should be an array." });
        }

        if (causes && !Array.isArray(causes)) {
            return res.status(400).json({ message: "Causes should be an array." });
        }

        // Update the user's fields if data is provided
        user.name = name || user.name;
        user.email = email || user.email;
        user.skills = skills || user.skills;
        user.causes = causes || user.causes;

        const updatedUser = await user.save();
        
        res.status(200).json({
            message: 'User updated successfully.',
            user: updatedUser
        });
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ message: 'Error updating user.', error: err.message });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Error fetching users", error: err.message });
    }
};

module.exports = { 
    registerUser, 
    getAllUsers, 
    loginUser, 
    logoutUser, 
    getUserProfile, 
    deleteUser, 
    updateUser 
};
