const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // e.g. "Tally ERP.9", "C++"
    code: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);