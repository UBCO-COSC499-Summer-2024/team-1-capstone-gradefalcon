const express = require('express');
const { getAllInstructors, getAllStudents, getAllAdmins } = require('../controllers/userController');

const router = express.Router();

router.get('/instructors', getAllInstructors);
router.get('/students', getAllStudents);
router.get('/admins', getAllAdmins);

module.exports = router;
