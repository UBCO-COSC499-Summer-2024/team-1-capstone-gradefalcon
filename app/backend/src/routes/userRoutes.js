const express = require('express');
const { getAllInstructors, getAllStudents, getAllAdmins, createUser, updateUser } = require('../controllers/userController');

const router = express.Router();

router.get('/instructors', getAllInstructors);
router.get('/students', getAllStudents);
router.get('/admins', getAllAdmins);
router.post('/users', createUser);
router.put('/users/:id', updateUser);

module.exports = router;