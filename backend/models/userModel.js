const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true  // Trims whitespace
    },
    email: {
        type: String,
        required: true,
        unique: true,  // Ensure email is unique
        lowercase: true,  // Converts email to lowercase
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        select: false // Excludes 'code' from query results
    },
    authorization: {
        type: Boolean,
        default: false  // Default to false (unauthorized)
    },
    likedProjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }]
}, { timestamps: true });

// Pre-save middleware to hash password and set authorization
userSchema.pre('save', async function (next) {
    try {
      // Hash password if it has been modified or is new
      if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
      }
  
      // Set authorization based on the code
      if (this.code === process.env.ADMIN_CODE) {
        this.authorization = true; // Admin authorization
      } else {
        this.authorization = false; // Student authorization
      }
  
      // Remove the code field after validation
      this.code = undefined;
  
      next();
    } catch (err) {
      next(err);
    }
});

module.exports = mongoose.model('User', userSchema);
