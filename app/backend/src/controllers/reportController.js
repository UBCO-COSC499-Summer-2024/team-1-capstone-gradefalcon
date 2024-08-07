const pool = require('../utils/db');

const getMessages = async (req, res, next) => {
  try {
    const instructorId = req.auth.sub;
    const messagesQuery = `
      SELECT m.*, s.student_id, s.class_id, e.exam_id, c.course_id
      FROM messages m
      JOIN student s ON m.sender_id = s.student_id
      JOIN exam e ON m.exam_id = e.exam_id
      JOIN classes c ON e.class_id = c.class_id
      WHERE m.receiver_id = $1
    `;
    const messagesResult = await pool.query(messagesQuery, [instructorId]);
    res.json(messagesResult.rows);
  } catch (error) {
    next(error);
  }
};

const fetchMessages = async (req, res) => {
  const { exam_id, student_id } = req.params;
  console.log(`Fetching messages for exam_id: ${exam_id}, student_id: ${student_id}`); // Debugging

  try {
    const result = await pool.query(
      `SELECT * FROM messages WHERE exam_id = $1 AND (sender_id = $2 OR receiver_id = $2) ORDER BY message_time ASC`,
      [exam_id, student_id]
    );

    console.log('SQL Query:', `SELECT * FROM messages WHERE exam_id = ${exam_id} AND (sender_id = ${student_id} OR receiver_id = ${student_id}) ORDER BY message_time ASC`); // Debugging
    console.log('Fetched messages:', result.rows); // Debugging
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Send message
const sendMessage = async (req, res) => {
  const { sender_id, sender_type, receiver_id, receiver_type, exam_id, message_text } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO messages (sender_id, sender_type, receiver_id, receiver_type, exam_id, message_text, message_time) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
       RETURNING *`,
      [sender_id, sender_type, receiver_id, receiver_type, exam_id, message_text]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete message
const deleteMessage = async (req, res) => {
  const { message_id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM messages WHERE message_id = $1 RETURNING *`,
      [message_id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getMessages, fetchMessages, sendMessage, deleteMessage };
