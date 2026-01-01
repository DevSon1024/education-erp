const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    interestedCourse: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    source: { type: String, enum: ['Walk-in', 'Social Media', 'Reference', 'Online'], default: 'Walk-in' },
    status: { type: String, enum: ['Pending', 'Follow-up', 'Converted', 'Closed'], default: 'Pending' },
    remarks: { type: String },
    followUpDate: { type: Date },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);