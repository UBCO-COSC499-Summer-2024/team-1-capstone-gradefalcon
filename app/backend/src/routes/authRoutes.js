const express = require('express');
const { login, signup, logout } = require('../controllers/authController');

const router = express.Router();

router.post('/logout', logout);
router.post('/login', login);
router.post('/signup', signup);

module.exports = router;