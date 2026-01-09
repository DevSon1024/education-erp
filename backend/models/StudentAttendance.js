const mongoose = require('mongoose');

const studentAttendanceSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    
    // Batch Info (Snapshot)
    batchName: { type: String, required: true },
    batchTime: { type: String, required: true },
    
    // Student Info
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    
    // Status
    isPresent: { type: Boolean, default: true },
    remarks: { type: String },
    
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

}, { timestamps: true });

// Prevent duplicate attendance for same student on same date?
// Optional: studentAttendanceSchema.index({ date: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('StudentAttendance', studentAttendanceSchema);
