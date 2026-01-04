const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    // Personal Details
    firstName: { type: String, required: true },
    middleName: { type: String }, // Father/Husband Name
    lastName: { type: String },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    dob: { type: Date },
    email: { type: String },
    
    // Contact Details
    contactHome: { type: String },
    contactStudent: { type: String },
    contactParent: { type: String },
    
    // Education & Address
    education: { type: String }, 
    qualification: { type: String }, 
    address: { type: String },
    state: { type: String },
    city: { type: String, default: 'Surat' },

    // Inquiry Specifics
    interestedCourse: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    source: { 
        type: String, 
        enum: ['Walk-in', 'Social Media', 'Reference', 'Online', 'Call'], 
        default: 'Walk-in' 
    },
    inquiryDate: { type: Date, default: Date.now },
    status: { 
        type: String, 
        enum: ['Open', 'Close', 'Complete', 'Recall', 'InProgress', 'Pending', 'Converted'], 
        default: 'Open' 
    },
    
    // Follow-ups & Remarks
    followUpDate: { type: Date },
    followUpDetails: { type: String }, 
    remarks: { type: String }, // Additional remarks
    
    // Allocation
    allocatedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 

    // Assets
    studentPhoto: { type: String }, 

    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);