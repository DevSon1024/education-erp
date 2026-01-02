const asyncHandler = require('express-async-handler');
const UserRight = require('../models/UserRight');

const checkPermission = (page, action) => asyncHandler(async (req, res, next) => {
    // Super Admin has all access
    if (req.user && req.user.role === 'Super Admin') {
        return next();
    }

    const userRights = await UserRight.findOne({ user: req.user._id });

    if (!userRights) {
        res.status(403);
        throw new Error('Access denied. No permissions assigned.');
    }

    const pagePermission = userRights.permissions.find(p => p.page === page);

    if (!pagePermission || !pagePermission[action]) {
        res.status(403);
        throw new Error(`Access denied. You do not have permission to ${action} ${page}.`);
    }

    next();
});

module.exports = { checkPermission };