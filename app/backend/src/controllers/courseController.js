const pool = require('../utils/db');

// Function to get courses for a student
const getCoursesForStudent = async (req, res, next) => {
  const { studentId } = req.params;

  try {
    const result = await pool.query(`
      SELECT c.class_id, c.course_id, c.course_name
      FROM classes c
      JOIN enrollment e ON c.class_id = e.class_id
      WHERE e.student_id = $1
    `, [studentId]);

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { getCoursesForStudent };
