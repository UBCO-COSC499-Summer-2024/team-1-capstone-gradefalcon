const express = require('express');
const { displayClasses, displayClassManagement, importClass } = require('../controllers/classController');

const router = express.Router();

router.post('/classes', displayClasses);
router.post('/classManagement/:class_id', displayClassManagement);
router.post('/import-class', importClass);

router.param('class_id', (req, res, next, class_id) => {
  req.session.class_id = class_id;
  req.session.save();
  next();
});

module.exports = router;
