const express = require('express');
const { displayClasses, displayClassManagement, importClass } = require('../controllers/classController');
const { jwtCheck, checkPermissions } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(jwtCheck); // Apply JWT check to all routes

router.post('/classes', checkPermissions(['view:classes']), displayClasses);
router.post('/classManagement/:class_id', checkPermissions(['view:classManagement']), displayClassManagement);
router.post('/import-class', checkPermissions(['import:class']), importClass);

router.param('class_id', (req, res, next, class_id) => {
  req.session.class_id = class_id;
  req.session.save();
  next();
});

module.exports = router;
