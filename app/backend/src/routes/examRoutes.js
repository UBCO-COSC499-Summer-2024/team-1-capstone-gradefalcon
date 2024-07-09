const express = require('express');
const { saveQuestions, newExam, examBoard, getStandardAverageData, getPerformanceData , getStudentGrades } = require('../controllers/examController');

const router = express.Router();

router.post('/saveQuestions', saveQuestions);
router.post('/NewExam/:class_id', newExam);
router.post('/ExamBoard', examBoard);
router.get('/standard-average-data', getStandardAverageData);
router.get('/performance-data', getPerformanceData);
router.get('/grades/:studentId', getStudentGrades);


module.exports = router;
