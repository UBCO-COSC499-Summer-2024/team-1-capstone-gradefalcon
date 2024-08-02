// messagesRoutes.js
const express = require('express');
const { checkJwt, checkPermissions } = require('../auth0');
const { getMessages } = require('../controllers/reportController');
const router = express.Router();

router.get('/messages', checkJwt, checkPermissions(['read:messages']), async (req, res) => {
  try {
    const messages = await getMessages();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).send('Failed to fetch messages');
  }
});

module.exports = router;
