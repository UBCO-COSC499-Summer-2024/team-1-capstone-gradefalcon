const express = require('express');
const { displayClasses, displayClassManagement, importClass } = require('../controllers/classController');
const { checkJwt, checkRole } = require('../server'); // Importing from server.js

const router = express.Router();

router.post('/classes', checkJwt, checkRole('instructor'), displayClasses);
router.post('/classManagement/:class_id', checkJwt, checkRole('instructor'), displayClassManagement);
router.post('/import-class', checkJwt, checkRole('instructor'), importClass);

router.param('class_id', (req, res, next, class_id) => {
  req.session.class_id = class_id;
  req.session.save();
  next();
});

module.exports = router;
