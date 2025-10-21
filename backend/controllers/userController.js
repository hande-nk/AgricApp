const User = require('../models/userModel');
const Project = require('../models/projectModel'); // Import Project model
const mongoose = require('mongoose');

// Get all users
const getUsers = async (req, res) => {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json(users);
};

// Get a single user by ID
const getUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ message: 'Invalid id' });
    }

    const user = await User.findById(id);
    if (!user){
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
};

// Create a new user
const createUser = async (req, res) => {
    const { name, email, password, code, authorization } = req.body;  
    try {
        const user = await User.create({ name, email, password, code, authorization });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a user
// controllers/userController.js

const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ message: 'Invalid id' });
    }

    try {
        // Check if the requester is an admin
        if (!req.user.authorization) { 
            return res.status(403).json({ message: 'Not authorized to delete users' });
        }

        // Prevent admins from deleting themselves
        if (req.user._id.toString() === id) {
            return res.status(400).json({ message: 'Admins cannot delete themselves' });
        }

        const user = await User.findOneAndDelete({ _id: id });

        if (!user){
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Update a user
const updateUser = async (req, res) => {
    const { id } = req.params;

    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Invalid id' });
    }

    const user = await User.findOneAndUpdate(
        { _id: id },
        { ...req.body },
        { new: true }
    );

    // If no user is found, return a 404 error
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
};

// Get user profile (New function)
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId)
            .populate('likedProjects') // Populate liked projects
            .select('-password -code'); // Exclude sensitive fields

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = {
    getUsers, 
    getUser,
    createUser,
    deleteUser,
    updateUser,
    getUserProfile // Export the new function
};
