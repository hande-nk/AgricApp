const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const { 
    getJobs, 
    getJob,
    createJob,
    deleteJob,
    updateJob,
    applyForJob 
} = require('../controllers/jobController');

const router = express.Router();

// GET all jobs
router.get('/', getJobs);

// GET a single job
router.get('/:id', getJob);

// POST a new job (Protected Route)
router.post('/', requireAuth, createJob);

// DELETE a job
router.delete('/:id', deleteJob);

// UPDATE a job
router.patch('/:id', updateJob);

// Apply for a job (Protected Route)
router.post('/apply', requireAuth, applyForJob);

module.exports = router;
