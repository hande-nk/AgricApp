const Job = require('../models/jobModel');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const User = require('../models/userModel');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// get all jobs
const getJobs = async (req, res) => {
    const jobs = await Job.find({}).sort({ createdAt: -1 });
    res.status(200).json(jobs);
};

// get a single job
const getJob = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Invalid id' });
    }

    const job = await Job.findById(id);
    if (!job) {
        return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json(job);
};



const createJob = async (req, res) => {
  const { title, description, requirements, salary, length } = req.body;

  console.log('Received Job Data:', req.body); // Add this line

  // Ensure all fields are provided
  if (!title || !description || !requirements || !salary || !length) {
      return res.status(400).json({ error: 'Please fill in all fields' });
  }

  try {
      // Check if the user is an admin
      if (!req.user.authorization) {  // req.user.authorization should be true for admins
          return res.status(403).json({ error: 'Not authorized to add jobs' });
      }

      const owner = req.user.email; // Use the user's email as the job owner
      const job = await Job.create({ title, description, requirements, salary, length, owner });

      res.status(201).json(job);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};




// delete a job
const deleteJob = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Invalid id' });
    }

    const job = await Job.findOneAndDelete({ _id: id });

    if (!job) {
        return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json(job);
};

// update a job
const updateJob = async (req, res) => {
    const { id } = req.params;
    const { owner, applied_ids } = req.body;

    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Invalid id' });
    }

    // Validate email format if the owner field is being updated
    if (owner && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(owner)) {
        return res.status(400).json({ error: 'Owner must be a valid email' });
    }

    // Ensure applied_ids is an array of valid ObjectIds
    if (applied_ids && !Array.isArray(applied_ids)) {
        return res.status(400).json({ error: 'applied_ids must be an array of user IDs' });
    }

    // Find the job and update it
    const job = await Job.findOneAndUpdate(
        { _id: id },
        { ...req.body },
        { new: true }  // Add { new: true } to return the updated document
    );

    // If no job is found, return a 404 error
    if (!job) {
        return res.status(404).json({ message: 'Job not found' });
    }

    // Return the updated job
    res.status(200).json(job);
};

const applyForJob = async (req, res) => {
    const { jobId, jobTitle, ownerEmail, message } = req.body;
  
    try {
      // Fetch applicant's details
      const applicant = await User.findById(req.user._id).select('name email');
  
      // Validate data
      if (!applicant || !message || !jobTitle || !ownerEmail) {
        return res.status(400).json({ error: 'Missing required information.' });
      }
  
      // Configure nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail', // e.g., 'gmail'
        auth: {
          user: process.env.EMAIL_USER, // Your email address
          pass: process.env.EMAIL_PASS, // Your email password or app password
        },
      });
  
      // Email options
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: ownerEmail,
        subject: `${applicant.name} applied to the ${jobTitle}`,
        text: `Name: ${applicant.name}\nEmail: ${applicant.email}\n\nMessage:\n${message}`,
      };
  
      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).json({ error: 'Failed to send email.' });
        } else {
          console.log('Email sent:', info.response);
          return res.status(200).json({ message: 'Application sent successfully.' });
        }
      });
    } catch (error) {
      console.error('Error in applyForJob:', error);
      res.status(500).json({ error: 'An error occurred while applying for the job.' });
    }
  };
  
  
  

module.exports = {
    getJobs,
    getJob,
    createJob,
    deleteJob,
    updateJob,
    applyForJob
};


