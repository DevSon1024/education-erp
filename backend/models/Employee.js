const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    // --- Personal Information ---
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    type: { 
        type: String, 
        enum: ['Manager', 'Faculty', 'Marketing Person', 'Branch Director', 'Receptionist', 'Other'],
        required: true 
    },
    email: { type: String, required: true, unique: true },
    duration: { type: String }, // e.g. "2 Years Contract"
    dob: { type: Date },
    education: { type: String },
    qualification: { type: String },
    address: { type: String },
    photo: { type: String }, // Path to image file
    isActive: { type: Boolean, default: true },

    // --- Work Experience ---
    experience: { type: String }, // e.g. "5 Years"
    workingTimePeriod: { type: String }, // e.g. "2018-2023"
    companyName: { type: String },
    role: { type: String },

    // --- Login Integration ---
    userAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Link to Auth User
    loginUsername: { type: String }, // Stored for display convenience
    isLoginActive: { type: Boolean, default: true },

    isDeleted: { type: Boolean, default: false }

}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);