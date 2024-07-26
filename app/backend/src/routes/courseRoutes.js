const express = require('express');
const { checkJwt, checkPermissions} = require('../auth0');
const { getCoursesForStudent } = require('../controllers/courseController');

const router = express.Router();

router.get('/student/:studentId', checkJwt, checkPermissions(['read:courses']), getCoursesForStudent);

module.exports = router;
