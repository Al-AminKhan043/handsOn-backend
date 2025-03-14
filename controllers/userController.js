const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
};

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

        res.status(201).json({ message: "User registered successfully!", user });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

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

        const token = generateToken(user._id);
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email,
                skills: user.skills, // ✅ FIXED
                causes: user.causes  // ✅ FIXED
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Error logging in", error: err.message });
    }
};

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

const getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id.trim();
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user profile.', error: err.message });
    }
};

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

const updateUser = async (req, res) => {
    try {
        const { name, email, skills, causes } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.skills = skills || user.skills;  // ✅ FIXED
        user.causes = causes || user.causes;  // ✅ FIXED

        const updatedUser = await user.save();
        res.status(200).json({
            message: 'User updated successfully.',
            user
        });
    } catch (err) {
        res.status(500).json({ message: 'Error updating user.', error: err.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Error fetching users", error: err.message });
    }
};

module.exports = { registerUser, getAllUsers, loginUser, logoutUser, getUserProfile, deleteUser, updateUser };
