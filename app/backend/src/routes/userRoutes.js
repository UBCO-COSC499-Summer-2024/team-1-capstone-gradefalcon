const express = require('express');
const { checkJwt, checkPermissions } = require('../auth0');
const { getAllInstructors, getAllStudents, getAllAdmins, createUser, updateUser } = require('../controllers/userController');

const router = express.Router();

router.get('/instructors', checkJwt, checkPermissions(['read:instructors']), getAllInstructors);
router.get('/students', checkJwt, checkPermissions(['read:students']), getAllStudents);
router.get('/admins', checkJwt, checkPermissions(['read:admins']), getAllAdmins);
router.post('/users', checkJwt, checkPermissions(['create:user']), createUser);
router.put('/users/:id', checkJwt, checkPermissions(['update:user']), updateUser);

module.exports = router;