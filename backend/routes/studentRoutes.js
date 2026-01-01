const express = require('express');
const router = express.Router();
const { getStudents, createStudent, deleteStudent } = require('../controllers/studentController');
const { protect } = require('../middlewares/authMiddleware');

// Add protect middleware to ensure only logged in users can access
router.route('/')
    .get(protect, getStudents)
    .post(protect, createStudent);

router.route('/:id')
    .delete(protect, deleteStudent);

module.exports = router;