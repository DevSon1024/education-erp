const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    regNo: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    
    // Relations
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    batch: { type: String, required: true }, 
    
    // Details
    fatherName: { type: String },
    dob: { type: Date },
    gender: { type: String },
    address: { type: String },
    
    // Status
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

// REMOVED the "pre(/^find/)" middleware block
// We will filter in the controller instead.

module.exports = mongoose.model('Student', studentSchema);