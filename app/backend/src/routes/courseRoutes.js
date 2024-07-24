const express = require('express');
const { checkJwt, checkPermissions, checkRole } = require('../auth0');
const { getCoursesForStudent } = require('../controllers/courseController');

const router = express.Router();

router.get('/student/:studentId', checkJwt, checkRole('student'), checkPermissions(['read:courses']), getCoursesForStudent);

module.exports = router;
