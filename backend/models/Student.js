const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    regNo: { type: String, required: true, unique: true }, // Auto-generated
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    
    // Relations
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    batch: { type: String, required: true }, // Simple string for now or ID
    
    // Details
    fatherName: { type: String },
    dob: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    address: { type: String },
    
    // Status
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

// Query Middleware for Soft Delete
studentSchema.pre(/^find/, function(next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

module.exports = mongoose.model('Student', studentSchema);