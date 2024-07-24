const express = require('express');
const { checkJwt, checkPermissions, checkRole } = require('../auth0');
const { displayClasses, displayClassManagement, importClass } = require('../controllers/classController');

const router = express.Router();

router.post('/classes', checkJwt, checkRole('instructor'), checkPermissions(['read:classes']), displayClasses);
router.post('/classManagement/:class_id', checkJwt, checkRole('instructor'), checkPermissions(['read:classManagement']), displayClassManagement);
router.post('/import-class', checkJwt, checkRole('instructor'), checkPermissions(['import:class']), importClass);

router.param('class_id', (req, res, next, class_id) => {
  req.session.class_id = class_id;
  req.session.save();
  next();
});

module.exports = router;
