const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., "Morning Batch (9-11)"
    time: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

batchSchema.pre(/^find/, function(next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

module.exports = mongoose.model('Batch', batchSchema);