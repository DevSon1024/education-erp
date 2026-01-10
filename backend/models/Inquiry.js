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
    
    // System Source (Defines if it's DSR, Walk-in/Offline, etc.)
    source: { 
        type: String, 
        enum: ['Walk-in', 'Social Media', 'Reference', 'Online', 'Call', 'DSR', 'QuickContact'], 
        default: 'Walk-in' 
    },
    
    // Specific Reference Detail (e.g. Name of person, specific newspaper)
    referenceBy: { type: String }, 

    inquiryDate: { type: Date, default: Date.now },
    status: { 
        type: String, 
        enum: ['Open', 'Close', 'Complete', 'Recall', 'InProgress', 'Pending', 'Converted'], 
        default: 'Open' 
    },
    
    // Follow-ups & Remarks
    followUpDate: { type: Date }, // Stores Date and Time
    followUpDetails: { type: String }, 
    
    // Extended Follow-up fields
    nextVisitingDate: { type: Date },
    visitReason: { type: String },
    
    remarks: { type: String }, 
    
    // Allocation
    allocatedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 

    // Assets
    studentPhoto: { type: String }, 

    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);