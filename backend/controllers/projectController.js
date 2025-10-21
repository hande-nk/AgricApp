const Project = require('../models/projectModel');
const User = require('../models/userModel'); 
const mongoose = require('mongoose');

// Get all projects
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({}).sort({ createdAt: -1 });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get a single project
const getProject = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Invalid project ID' });
    }

    try {
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Create a new project
const createProject = async (req, res) => {
    const { title, description, equipments, cost, time } = req.body;

    try {
        // Get the creator's name from the authenticated user
        const creator = req.user.name;

        // Create the new project with the creator's name
        const project = await Project.create({
            title,
            description,
            equipments,
            cost,
            time,
            likes: 0, // Initialize likes to 0
            creator
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Delete a project
const deleteProject = async (req, res) => {
    const { id } = req.params;
  
    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Invalid project ID' });
    }
  
    try {
      // Find the project by ID
      const project = await Project.findById(id);
  
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      // Check if the user is authorized to delete
      // User can delete if they are the creator or if they have admin privileges
      if (project.creator !== req.user.name && !req.user.authorization) {
        return res.status(403).json({ error: 'Not authorized to delete this project' });
      }
  
      // Proceed to delete the project
      await Project.findByIdAndDelete(id);
  
      res.status(200).json({ message: 'Project deleted successfully', _id: id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  


// Update a project
const updateProject = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Invalid project ID' });
    }

    try {
        const project = await Project.findOneAndUpdate(
            { _id: id },
            { ...req.body },
            { new: true }
        );
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Increment project likes
const updateLikes = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id; // Get the authenticated user's ID

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Invalid project ID' });
    }

    try {
        // Check if the user has already liked the project
        const user = await User.findById(userId);

        if (user.likedProjects.includes(id)) {
            return res.status(400).json({ message: 'You have already liked this project' });
        }

        // Increment the project's likes
        const project = await Project.findByIdAndUpdate(
            id,
            { $inc: { likes: 1 } },
            { new: true }
        );

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Add the project to the user's liked projects
        user.likedProjects.push(id);
        await user.save();

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




module.exports = {
    getProjects,
    getProject,
    createProject,
    deleteProject,
    updateProject,
    updateLikes
};
