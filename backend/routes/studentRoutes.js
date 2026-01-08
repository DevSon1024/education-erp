const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware');
const { 
    getStudents, 
    getStudentById, // Imported
    createStudent, 
    deleteStudent, 
    toggleStudentStatus 
} = require('../controllers/studentController');

router.route('/')
    .get(protect, checkPermission('Student', 'view'), getStudents)
    .post(protect, checkPermission('Student', 'add'), createStudent);

router.route('/:id')
    .get(protect, checkPermission('Student', 'view'), getStudentById) // Added GET for single student
    .delete(protect, checkPermission('Student', 'delete'), deleteStudent);

router.route('/:id/toggle')
    .put(protect, checkPermission('Student', 'edit'), toggleStudentStatus);

module.exports = router;