const express = require('express');
const { getAllInstructors, getAllStudents, getAllAdmins, createUser, updateUser } = require('../controllers/userController');
const { jwtCheck, checkPermissions } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(jwtCheck); // Apply JWT check to all routes

router.get('/instructors', checkPermissions(['view:instructors']), getAllInstructors);
router.get('/students', checkPermissions(['view:students']), getAllStudents);
router.get('/admins', checkPermissions(['view:admins']), getAllAdmins);
router.post('/users', checkPermissions(['create:user']), createUser);
router.put('/users/:id', checkPermissions(['update:user']), updateUser);

module.exports = router;
