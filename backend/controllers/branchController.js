const asyncHandler = require('express-async-handler');
const Branch = require('../models/Branch');

// @desc    Create a new branch
// @route   POST /api/branches
// @access  Private/Super Admin
const createBranch = asyncHandler(async (req, res) => {
    const { name, shortCode, phone, mobile, email, address, city, state, isActive } = req.body;

    // Check if branch already exists
    const branchExists = await Branch.findOne({ $or: [{ name }, { shortCode }] });

    if (branchExists) {
        res.status(400);
        throw new Error('Branch with this name or short code already exists');
    }

    const branch = await Branch.create({
        name,
        shortCode,
        phone,
        mobile,
        email,
        address,
        city,
        state,
        isActive: isActive === undefined ? true : isActive
    });

    if (branch) {
        res.status(201).json(branch);
    } else {
        res.status(400);
        throw new Error('Invalid branch data');
    }
});

// @desc    Get all branches
// @route   GET /api/branches
// @access  Private/Super Admin (or authorized)
const getBranches = asyncHandler(async (req, res) => {
    const branches = await Branch.find({}).sort({ createdAt: -1 });
    res.json(branches);
});

// @desc    Get branch by ID
// @route   GET /api/branches/:id
// @access  Private
const getBranchById = asyncHandler(async (req, res) => {
    const branch = await Branch.findById(req.params.id);

    if (branch) {
        res.json(branch);
    } else {
        res.status(404);
        throw new Error('Branch not found');
    }
});

// @desc    Update branch
// @route   PUT /api/branches/:id
// @access  Private/Super Admin
const updateBranch = asyncHandler(async (req, res) => {
    const branch = await Branch.findById(req.params.id);

    if (branch) {
        branch.name = req.body.name || branch.name;
        branch.shortCode = req.body.shortCode || branch.shortCode;
        branch.phone = req.body.phone || branch.phone;
        branch.mobile = req.body.mobile || branch.mobile;
        branch.email = req.body.email || branch.email;
        branch.address = req.body.address || branch.address;
        branch.city = req.body.city || branch.city;
        branch.state = req.body.state || branch.state;
        
        if (req.body.isActive !== undefined) {
            branch.isActive = req.body.isActive;
        }

        const updatedBranch = await branch.save();
        res.json(updatedBranch);
    } else {
        res.status(404);
        throw new Error('Branch not found');
    }
});

// @desc    Delete branch
// @route   DELETE /api/branches/:id
// @access  Private/Super Admin
const deleteBranch = asyncHandler(async (req, res) => {
    const branch = await Branch.findById(req.params.id);

    if (branch) {
        await branch.deleteOne();
        res.json({ message: 'Branch removed' });
    } else {
        res.status(404);
        throw new Error('Branch not found');
    }
});

module.exports = {
    createBranch,
    getBranches,
    getBranchById,
    updateBranch,
    deleteBranch
};
