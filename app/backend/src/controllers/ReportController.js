const { get } = require('../routes/reportRoutes');
const pool = require('../utils/db');

// Get all reports made by a specific student
const getStudentReports = async (req, res, next) => {
  try {
    const auth0Id = req.auth.sub; // get auth0_id obtained from Auth0
    
    // Step 1: Fetch student_id using auth0_id
    const studentQuery = `
      SELECT student_id
      FROM student
      WHERE auth0_id = $1
    `;
    const studentResult = await pool.query(studentQuery, [auth0Id]);

    if (studentResult.rowCount === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const studentId = studentResult.rows[0].student_id;

    // Step 2: Fetch reports using student_id
    const reportsQuery = `
      SELECT m.*, e.exam_id, e.exam_title, c.course_name
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

// Get all reports for a specific instructor
const getInstructorReports = async (req, res, next) => {
  try {
    const instructorId = req.auth.sub; // get instructor_id obtained from auth0
    const reportsQuery = `
       SELECT r.*, e.exam_id, e.exam_title, c.course_name, s.name as student_name, r.status
      FROM report r
      JOIN exam e ON r.exam_id = e.exam_id
      JOIN classes c ON e.class_id = c.class_id
      JOIN student s ON r.student_id = s.student_id
      WHERE c.instructor_id = $1
    `;
    const reportsResult = await pool.query(reportsQuery, [instructorId]);
    res.json(reportsResult.rows);
  } catch (error) {
    next(error);
  }
};

// Get a specific report by report_id
const getReportById = async (req, res, next) => {
  const { report_id } = req.params;
  console.log(`Fetching report with ID: ${report_id}`);
  try {
    const reportQuery = `
    SELECT r.*, e.exam_title, e.total_marks, c.course_name, s.name AS student_name, sr.grade
      FROM report r
      JOIN exam e ON r.exam_id = e.exam_id
      JOIN classes c ON e.class_id = c.class_id
      JOIN student s ON r.student_id = s.student_id
      LEFT JOIN studentResults sr ON sr.exam_id = e.exam_id AND sr.student_id = r.student_id
      WHERE r.report_id = $1
    `;
    const reportResult = await pool.query(reportQuery, [report_id]);

    console.log("Report Result:", reportResult.rows); // Log the query result

    if (reportResult.rowCount === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(reportResult.rows[0]);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



// Send a report
const sendReport = async (req, res) => {
  const auth0Id = req.auth.sub; 
  const { exam_id, report_text } = req.body;

  try {
    // First, find the student_id based on the auth0_id
    const studentQuery = `
      SELECT student_id 
      FROM student 
      WHERE auth0_id = $1
    `;
    const studentResult = await pool.query(studentQuery, [auth0Id]);

    if (studentResult.rowCount === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const studentId = studentResult.rows[0].student_id;

    // Insert the report using the found student_id
    const insertReportQuery = `
      INSERT INTO report (exam_id, student_id, report_text, report_time) 
      VALUES ($1, $2, $3, NOW()) 
      RETURNING *
    `;
    const reportResult = await pool.query(insertReportQuery, [exam_id, studentId, report_text]);

    res.json(reportResult.rows[0]);
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

const reopenReport = async (req, res) => {
  const { report_id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE report 
       SET status = 'Pending'
       WHERE report_id = $1
       RETURNING *`,
      [report_id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error reopening report:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getStudentReports, getInstructorReports, sendReport, replyToReport, deleteReport, getReportById, reopenReport };
