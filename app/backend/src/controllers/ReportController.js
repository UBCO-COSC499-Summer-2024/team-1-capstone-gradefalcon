const pool = require('../utils/db');

// Get all reports made by a specific student
const getStudentReports = async (req, res, next) => {
  try {
    const studentId = req.auth.sub; // Assuming student_id is obtained from auth0
    const reportsQuery = `
      SELECT m.*, e.exam_id, e.exam_title, c.course_name, m.status
      FROM report m
      JOIN exam e ON m.exam_id = e.exam_id
      JOIN classes c ON e.class_id = c.class_id
      WHERE m.student_id = $1
    `;
    const reportsResult = await pool.query(reportsQuery, [studentId]);
    res.json(reportsResult.rows);
  } catch (error) {
    next(error);
  }
};

// Send a report
const sendReport = async (req, res) => {
  const { student_id, exam_id, report_text } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO report (exam_id, student_id, report_text) 
       VALUES ($1, $2, $3, NOW()) 
       RETURNING *`,
      [exam_id, student_id, report_text]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error sending report:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Reply to a report (and close it)
const replyToReport = async (req, res) => {
  const { report_id } = req.params;
  const { reply_text } = req.body;
  try {
    const result = await pool.query(
      `UPDATE report 
       SET reply_text = $1, status = 'Closed'
       WHERE report_id = $2
       RETURNING *`,
      [reply_text, report_id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error replying to report:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete report
const deleteReport = async (req, res) => {
  const { report_id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM report WHERE report_id = $1 RETURNING *`,
      [report_id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getStudentReports, sendReport, replyToReport, deleteReport };
