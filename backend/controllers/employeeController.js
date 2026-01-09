const Employee = require('../models/Employee');
const User = require('../models/User');
const sendSMS = require('../utils/smsSender');
const asyncHandler = require('express-async-handler');

// @desc    Get Employees with Filters
const getEmployees = asyncHandler(async (req, res) => {
    const { joiningFrom, joiningTo, gender, searchBy, searchValue } = req.query;
    
    let query = { isDeleted: false };
    
    // 1. Date Range Filter (Joining Date)
    if (joiningFrom && joiningTo) {
        // Set time to start of day for 'from' and end of day for 'to'
        const startDate = new Date(joiningFrom);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(joiningTo);
        endDate.setHours(23, 59, 59, 999);

        query.dateOfJoining = { 
            $gte: startDate, 
            $lte: endDate 
        };
    }

    // 2. Gender Filter
    if (gender && gender !== 'All') {
        query.gender = gender;
    }
    
    // 3. Dynamic Search (Name, Email, Mobile)
    if (searchBy && searchValue) {
        const regex = { $regex: searchValue, $options: 'i' }; // Case-insensitive
        
        if (searchBy === 'name') {
            query.name = regex;
        } else if (searchBy === 'email') {
            query.email = regex;
        } else if (searchBy === 'mobile') {
            query.mobile = regex;
        }
    }

    const employees = await Employee.find(query).sort({ createdAt: -1 });
    res.json(employees);
});

// @desc    Create Employee
const createEmployee = asyncHandler(async (req, res) => {
    const { 
        name, email, mobile, gender, type, 
        loginUsername, loginPassword, isLoginActive 
    } = req.body;

    const empExists = await Employee.findOne({ email });
    if (empExists) {
        res.status(400); throw new Error('Employee with this email already exists');
    }

    let userId = null;

    if (loginUsername && loginPassword) {
        const userExists = await User.findOne({ email: loginUsername });
        if (userExists) {
            res.status(400); throw new Error(`User Login '${loginUsername}' already exists.`);
        }

        try {
            const newUser = await User.create({
                name,
                email: loginUsername,
                password: loginPassword,
                role: type,
                isActive: isLoginActive
            });
            userId = newUser._id;
        } catch (error) {
            res.status(400); throw new Error('User Login Error: ' + error.message);
        }
    }

    try {
        const count = await Employee.countDocuments();
        const regNo = `EMP-${new Date().getFullYear()}-${1001 + count}`;

        const employee = await Employee.create({
            ...req.body,
            regNo,
            userAccount: userId
        });

        if (userId && loginUsername) {
             const message = `Dear, ${name}. Your Registration process has been successfully completed. Reg.No. ${regNo}, User ID-${loginUsername}, Password-${loginPassword}, smart institute.`;
             sendSMS(mobile, message);
        }

        res.status(201).json(employee);

    } catch (error) {
        if(userId) await User.findByIdAndDelete(userId);
        res.status(400); throw new Error(error.message);
    }
});

// @desc    Update Employee
const updateEmployee = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { 
        name, type, isLoginActive, loginPassword 
    } = req.body;

    const employee = await Employee.findById(id);

    if (!employee) {
        res.status(404); throw new Error('Employee not found');
    }

    if (employee.userAccount) {
        const userUpdate = { name, role: type, isActive: isLoginActive };
        if (loginPassword && loginPassword.trim() !== '') {
            const user = await User.findById(employee.userAccount);
            if(user) {
                user.password = loginPassword;
                user.name = name;
                user.role = type;
                user.isActive = isLoginActive;
                await user.save();
            }
        } else {
            await User.findByIdAndUpdate(employee.userAccount, userUpdate);
        }
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedEmployee);
});

// @desc    Delete Employee
// @desc    Delete Employee Permanently
const deleteEmployee = asyncHandler(async (req, res) => {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (employee) {
        if(employee.userAccount) {
            await User.findByIdAndDelete(employee.userAccount);
        }
        res.json({ id: req.params.id, message: 'Employee Removed Permanently' });
    } else {
        res.status(404); throw new Error('Employee not found');
    }
});

module.exports = { getEmployees, createEmployee, updateEmployee, deleteEmployee };