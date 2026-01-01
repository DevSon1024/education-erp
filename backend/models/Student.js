const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    // --- System Fields ---
    enrollmentNo: { type: String, unique: true }, // Auto-generated
    regNo: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    branchName: { type: String, default: 'Main Branch' },

    // --- Personal Details ---
    admissionDate: { type: Date, required: true, default: Date.now },
    aadharCard: { type: String, required: true },
    firstName: { type: String, required: true },
    middleName: { type: String, required: true }, // Father/Husband
    lastName: { type: String, required: true },
    motherName: { type: String },
    
    dob: { type: Date, required: true },
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
    studentPhoto: { type: String }, // Path to image

    // --- Contact & Address ---
    email: { type: String },
    mobileStudent: { type: String },
    mobileParent: { type: String, required: true }, // Required
    contactHome: { type: String },
    
    address: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String },

    // --- Other Info ---
    occupationType: { type: String, enum: ['Service', 'Business', 'Student', 'Unemployed'] },
    occupationName: { type: String },
    education: { type: String },
    reference: { type: String, required: true }, // Source of inquiry

    // --- Academic & Fees ---
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    batch: { type: String, required: true },
    
    paymentMode: { type: String, enum: ['Cash', 'Online', 'EMI'], required: true },
    totalFees: { type: Number, required: true },
    pendingFees: { type: Number, required: true },
    
}, { timestamps: true });

// Middleware to generate Enrollment No (Simple Logic)
studentSchema.pre('save', async function(next) {
    if (!this.enrollmentNo) {
        const count = await mongoose.model('Student').countDocuments();
        this.enrollmentNo = `ENR${new Date().getFullYear()}${String(count + 1).padStart(4, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Student', studentSchema);