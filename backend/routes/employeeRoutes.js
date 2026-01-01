const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getEmployees, createEmployee, deleteEmployee } = require('../controllers/employeeController');

router.route('/')
    .get(protect, getEmployees)
    .post(protect, createEmployee);

router.route('/:id')
    .delete(protect, deleteEmployee);

module.exports = router;