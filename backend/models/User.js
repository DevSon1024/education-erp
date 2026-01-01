const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: [
            'Super Admin', 'Branch Admin', 'Teacher', 'Student', 
            'Manager', 'Faculty', 'Marketing Person', 'Branch Director', 'Receptionist', 'Other'
        ], 
        default: 'Student' 
    },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

// --- FIXED ENCRYPTION HOOK ---
// Removed 'next' parameter. Since it is 'async', Mongoose waits for it to finish automatically.
userSchema.pre('save', async function () {
    // 1. If password is not modified, do nothing and return
    if (!this.isModified('password')) return;
    
    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);