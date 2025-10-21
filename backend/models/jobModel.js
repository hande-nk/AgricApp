const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Job object structure
const jobSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    length: {
        type: Number,
        required: true
    },
    owner: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                // Simple regex for validating email format
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    applied_ids: {
        type: [Schema.Types.ObjectId], // Array of ObjectIds representing user IDs
        ref: 'User', // Reference to the User collection (assuming you have a User model)
        default: [] // Initialize as an empty array
    }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);


