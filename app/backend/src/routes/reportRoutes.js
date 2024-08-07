const express = require('express');
const { checkJwt, checkPermissions } = require('../auth0');
const { getStudentReports, sendReport, replyToReport, deleteReport } = require('../controllers/reportController');
const router = express.Router();

// Route to get reports made by a specific student
router.get('/student-reports', checkJwt, checkPermissions(['read:messages']), getStudentReports);

// Route to send a report
router.post('/reports', checkJwt, checkPermissions(['create:messages']), sendReport);

// Route to reply to a report and close it
router.put('/reports/:report_id/reply', checkJwt, checkPermissions(['update:messages']), replyToReport);

// Route to delete a report
router.delete('/reports/:report_id', checkJwt, checkPermissions(['delete:messages']), deleteReport);

module.exports = router;
