const asyncHandler = require('express-async-handler');
const UserRight = require('../models/UserRight');
const User = require('../models/User');

// @desc    Get User Rights by User ID
// @route   GET /api/user-rights/:userId
// @access  Private/Admin
const getUserRights = asyncHandler(async (req, res) => {
    const rights = await UserRight.findOne({ user: req.params.userId });
    if (rights) {
        res.json(rights);
    } else {
        // Return default empty structure if no rights exist yet
        res.json({ user: req.params.userId, permissions: [] });
    }
});

// @desc    Update or Create User Rights
// @route   POST /api/user-rights
// @access  Private/Admin
const saveUserRights = asyncHandler(async (req, res) => {
    const { userId, permissions } = req.body;

    let rights = await UserRight.findOne({ user: userId });

    if (rights) {
        rights.permissions = permissions;
        const updatedRights = await rights.save();
        res.json(updatedRights);
    } else {
        rights = await UserRight.create({
            user: userId,
            permissions
        });
        res.status(201).json(rights);
    }
});

// @desc    Get Current User's Permissions (For Frontend State)
// @route   GET /api/user-rights/me
// @access  Private
const getMyRights = asyncHandler(async (req, res) => {
    const rights = await UserRight.findOne({ user: req.user._id });
    res.json(rights ? rights.permissions : []);
});

module.exports = { getUserRights, saveUserRights, getMyRights };