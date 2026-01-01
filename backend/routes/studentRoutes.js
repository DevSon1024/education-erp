const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { 
    getStudents, 
    createStudent, 
    deleteStudent, 
    toggleStudentStatus // <--- This was likely missing in your import
} = require('../controllers/studentController');

// Route: /api/students
router.route('/')
    .get(protect, getStudents)
    .post(protect, createStudent);

// Route: /api/students/:id
router.route('/:id')
    .delete(protect, deleteStudent);

// Route: /api/students/:id/toggle (New Toggle Route)
router.route('/:id/toggle')
    .put(protect, toggleStudentStatus);

module.exports = router;