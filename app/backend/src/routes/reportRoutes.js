const express = require('express');
const { checkJwt, checkPermissions } = require('../auth0');
const { getStudentReports, sendReport, replyToReport, deleteReport, getInstructorReports, getReportById, reopenReport} = require('../controllers/reportController');
const router = express.Router();

// Route to get reports made by a specific student
router.get('/student-reports', checkJwt, checkPermissions(['read:messages']), getStudentReports);

// Route to send a report
router.post('/submit', checkJwt, checkPermissions(['create:messages']), sendReport);

// Route to reply to a report and close it
router.put('/:report_id/reply', checkJwt, checkPermissions(['create:messages']), replyToReport);

// Route to delete a report
router.delete('/:report_id', checkJwt, checkPermissions(['delete:messages']), deleteReport);

// Route to get reports for a specific instructor
router.get('/instructor-reports', checkJwt, checkPermissions(['read:exams']), getInstructorReports);

// Route to get a specific report by report_id
router.get('/:report_id', checkJwt, checkPermissions(['read:exams']), getReportById);

// Route to reopen a report
router.put('/:report_id/reopen', checkJwt, checkPermissions(['create:messages']), reopenReport);


module.exports = router;

