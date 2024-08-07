const express = require('express');
const { checkJwt, checkPermissions } = require('../auth0');
const { getMessages, fetchMessages, sendMessage, deleteMessage } = require('../controllers/reportController');
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

router.get('/messages/:exam_id/:student_id', checkJwt, checkPermissions(['read:messages']), fetchMessages);
router.post('/messages', checkJwt, checkPermissions(['create:messages']), sendMessage);
router.delete('/messages/:message_id', checkJwt, checkPermissions(['delete:messages']), deleteMessage); // New route

module.exports = router;
