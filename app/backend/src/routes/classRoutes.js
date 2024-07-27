const express = require('express');
const { checkJwt, checkPermissions} = require('../auth0');
const { displayClasses, displayClassManagement, importClass } = require('../controllers/classController');

const router = express.Router();

router.use((req, res, next) => {
  // console.log("Incoming request to /class route:");
  // console.log("Headers:", req.headers);
  // console.log("Body:", req.body);
  next();
});

router.post('/classes', checkJwt, (req, res, next) => {
  // console.log("After JWT check, before Permissions check");
  checkPermissions(['read:classes'])(req, res, next);
}, displayClasses);

router.post('/classManagement/:class_id', checkJwt, (req, res, next) => {
  // console.log("After JWT check, before Permissions check");
  checkPermissions(['read:classManagement'])(req, res, next);
}, displayClassManagement);

router.post('/import-class', checkJwt, (req, res, next) => {
  // console.log("After JWT check, before Permissions check");
  checkPermissions(['import:class'])(req, res, next);
}, importClass);

router.param('class_id', (req, res, next, class_id) => {
  req.session.class_id = class_id;
  req.session.save();
  next();
});

module.exports = router;
