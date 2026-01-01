const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    // --- Basic Info ---
    name: { type: String, required: true }, // e.g., "Advance Degree..."
    shortName: { type: String, required: true }, // e.g., "ADCA"
    image: { type: String }, // URL/Path to image
    description: { type: String },
    
    // --- Fees Structure ---
    courseFees: { type: Number, required: true },
    admissionFees: { type: Number, default: 0 },
    registrationFees: { type: Number, default: 0 },
    monthlyFees: { type: Number, default: 0 },
    totalInstallment: { type: Number, default: 1 },
    
    // --- Configuration ---
    sorting: { type: Number, default: 0 }, // For display order
    commission: { type: Number, default: 0 }, // In Percentage (%)
    
    // --- Duration & Type ---
    duration: { type: Number, required: true },
    durationType: { type: String, enum: ['Month', 'Year', 'Days'], default: 'Month' },
    courseType: { 
        type: String, 
        enum: ['Accounting', 'Designing', 'Diploma', 'IT for Beginners', 'Global IT Certifications'],
        required: true 
    },

    // --- Relations ---
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }], // Array of Subject IDs

    // --- Status ---
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);