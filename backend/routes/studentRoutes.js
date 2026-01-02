const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware'); // Import Permission Middleware
const { 
    getStudents, 
    createStudent, 
    deleteStudent, 
    toggleStudentStatus 
} = require('../controllers/studentController');

// Route: /api/students
router.route('/')
    // Requires 'Student' -> 'View'
    .get(protect, checkPermission('Student', 'view'), getStudents)
    // Requires 'Student' -> 'Add'
    .post(protect, checkPermission('Student', 'add'), createStudent);

// Route: /api/students/:id
router.route('/:id')
    // Requires 'Student' -> 'Delete'
    .delete(protect, checkPermission('Student', 'delete'), deleteStudent);

// Route: /api/students/:id/toggle
router.route('/:id/toggle')
    // Requires 'Student' -> 'Edit'
    .put(protect, checkPermission('Student', 'edit'), toggleStudentStatus);

module.exports = router;