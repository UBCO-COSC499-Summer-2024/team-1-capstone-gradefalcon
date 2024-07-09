const express = require('express');
const { getCoursesForStudent } = require('../controllers/courseController');
const router = express.Router();

// Route to get courses for a student
router.get('/student/:studentId', getCoursesForStudent);

module.exports = router;
