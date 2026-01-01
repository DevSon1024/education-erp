const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g. "Morning A"
    batchSize: { type: Number, required: true },
    
    // Time
    startTime: { type: String, required: true }, // "10:00"
    endTime: { type: String, required: true },   // "12:00"

    // Relations
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },

    // Duration
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Batch', batchSchema);