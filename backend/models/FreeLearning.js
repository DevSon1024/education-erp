const mongoose = require('mongoose');

const freeLearningSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [{ type: String, required: true }], // Array of options i.e. ["A", "B", "C", "D"]
    correctOption: { type: Number, required: true }, // Index of correct option (0-3)
    explanation: { type: String },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('FreeLearning', freeLearningSchema);
