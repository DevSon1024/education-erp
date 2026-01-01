const User = require('../models/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
    });
};

// @desc Register (Seed Initial Admin)
// @route POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({ name, email, password, role });
    if (user) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id, name: user.name, email: user.email, role: user.role
        });
    } else {
        res.status(400); throw new Error('Invalid user data');
    }
});

// @desc Login
// @route POST /api/auth/login
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id);
        res.json({
            _id: user._id, name: user.name, email: user.email, role: user.role
        });
    } else {
        res.status(401); throw new Error('Invalid email or password');
    }
});

// @desc Logout
// @route POST /api/auth/logout
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: 'Logged out' });
});

module.exports = { registerUser, loginUser, logoutUser };