const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    equipments: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    likes: {
        type: Number,
        required: true,
        default: 0 // Ensure likes have a default value of 0
    },
    creator: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
