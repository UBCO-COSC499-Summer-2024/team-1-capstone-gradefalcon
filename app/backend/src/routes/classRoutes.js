const express = require('express');
const { getClassInfo, getClassManagement } = require('../controllers/classController');

const router = express.Router();

router.post('/classes', getClassInfo);
router.post('/classManagement/:class_id', getClassManagement);

module.exports = router;
