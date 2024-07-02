const express = require('express');
const { saveQuestions, newExam, examBoard } = require('../controllers/examController');

const router = express.Router();

router.post('/saveQuestions', saveQuestions);
router.post('/NewExam/:class_id', newExam);
router.post('/ExamBoard', examBoard);

module.exports = router;
