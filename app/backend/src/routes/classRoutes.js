const express = require('express');
const { displayClasses, displayClassManagement, importClass , getAllCourses} = require('../controllers/classController');

const router = express.Router();

router.post('/classes', displayClasses);
router.post('/classManagement/:class_id', displayClassManagement);
router.post('/import-class', importClass);
router.get('/getAllCourses', getAllCourses);  // Updated route to fetch all courses

router.param('class_id', (req, res, next, class_id) => {
  req.session.class_id = class_id;
  req.session.save();
  next();
});

module.exports = router;
