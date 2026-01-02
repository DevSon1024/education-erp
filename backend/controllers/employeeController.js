const Employee = require('../models/Employee');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Get Employees
const getEmployees = asyncHandler(async (req, res) => {
    const { joiningFrom, joiningTo, gender, searchBy, searchValue } = req.query;
    let query = { isDeleted: false };
    
    if (joiningFrom && joiningTo) {
        query.createdAt = { $gte: new Date(joiningFrom), $lte: new Date(joiningTo) };
    }
    if (gender) query.gender = gender;
    
    if (searchBy && searchValue) {
        if (searchBy === 'Employee Name') query.name = { $regex: searchValue, $options: 'i' };
        else if (searchBy === 'Employee Mobile') query.mobile = { $regex: searchValue, $options: 'i' };
        else if (searchBy === 'Employee Email') query.email = { $regex: searchValue, $options: 'i' };
    }

    const employees = await Employee.find(query).sort({ createdAt: -1 });
    res.json(employees);
});

const createEmployee = asyncHandler(async (req, res) => {
    const { 
        name, email, mobile, gender, type, 
        loginUsername, loginPassword, isLoginActive 
    } = req.body;

    // console.log("--------------------------------");
    // console.log("RECEIVED PAYLOAD:", req.body); // DEBUG 1

    // 1. Check if Employee Email exists
    const empExists = await Employee.findOne({ email });
    if (empExists) {
        res.status(400); throw new Error('Employee with this email already exists');
    }

    let userId = null;

    // 2. Create User Account
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
                role: type, // <--- This fails if User Model Enum isn't updated
                isActive: isLoginActive
            });
            userId = newUser._id;
            // console.log("USER CREATED:", userId); // DEBUG 2
        } catch (error) {
            console.error("USER CREATION ERROR:", error.message); // DEBUG 3
            res.status(400); throw new Error('User Login Error: ' + error.message);
        }
    }

    // 3. Create Employee
    try {
        const employee = await Employee.create({
            ...req.body,
            userAccount: userId
        });
        res.status(201).json(employee);
    } catch (error) {
        // Cleanup if Employee fails but User was made
        if(userId) await User.findByIdAndDelete(userId);
        
        console.error("EMPLOYEE CREATION ERROR:", error.message); // DEBUG 4
        res.status(400); throw new Error(error.message);
    }
});

const deleteEmployee = asyncHandler(async (req, res) => {
    const employee = await Employee.findById(req.params.id);
    if (employee) {
        employee.isDeleted = true;
        if(employee.userAccount) {
            await User.findByIdAndUpdate(employee.userAccount, { isActive: false });
        }
        await employee.save();
        res.json({ message: 'Employee Removed' });
    } else {
        res.status(404); throw new Error('Employee not found');
    }
});

module.exports = { getEmployees, createEmployee, deleteEmployee };