const express = require('express');
const { checkJwt, checkPermissions } = require('../auth0');
const { displayClasses, displayClassManagement, importClass , getAllCourses , getStudentCourses} = require('../controllers/classController');
const router = express.Router();

router.use((req, res, next) => {
  next();
});

router.post('/classes', checkJwt, (req, res, next) => {
  checkPermissions(['read:classes'])(req, res, next);
}, displayClasses);

router.post('/classManagement/:class_id', checkJwt, (req, res, next) => {
  checkPermissions(['read:classManagement'])(req, res, next);
}, displayClassManagement);

router.post('/import-class', checkJwt, (req, res, next) => {
  checkPermissions(['import:class'])(req, res, next);
}, importClass);

router.get('/getAllCourses', checkJwt, (req, res, next) => {
  checkPermissions(['read:classes'])(req, res, next);
}, getAllCourses);

router.get('/student/courses', checkJwt, (req, res, next) => {
  checkPermissions(['read:courses_student'])(req, res, next);
}, getStudentCourses);

router.param('class_id', (req, res, next, class_id) => {
  req.session.class_id = class_id;
  req.session.save();
  next();
});

module.exports = router;
