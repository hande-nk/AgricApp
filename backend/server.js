require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const path = require('path') // Add path module to serve frontend
const projectRoutes = require('./routes/projects')
const jobRoutes = require('./routes/jobs')
const userRoutes = require('./routes/users')

const app = express()

// Middleware to parse JSON
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// API Routes
app.use('/api/projects/', projectRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/users', userRoutes)

// Serve the React frontend static files
app.use(express.static(path.join(__dirname, 'build')));

// Fallback route to serve index.html for any unknown routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error)
  })
