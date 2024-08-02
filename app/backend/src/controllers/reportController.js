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

module.exports = { getMessages };
