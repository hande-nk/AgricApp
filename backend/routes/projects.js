const express = require('express');
const requireAuth = require('../middleware/requireAuth');

const {
    getProjects,
    getProject,
    createProject,
    deleteProject,
    updateProject,
    updateLikes
} = require('../controllers/projectController');

const router = express.Router();

// Public routes
router.get('/', getProjects);
router.get('/:id', getProject);

// Protected routes
router.post('/', requireAuth, createProject);
router.put('/:id/like', requireAuth, updateLikes);
router.delete('/:id', requireAuth, deleteProject);
router.patch('/:id', requireAuth, updateProject);

module.exports = router;
