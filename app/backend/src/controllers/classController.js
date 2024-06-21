const pool = require('../utils/db');

const getClassInfo = async (req, res, next) => {
  try {
    const instructorId = req.session.userId;
    const result = await pool.query("SELECT * FROM classes WHERE instructor_id = $1", [instructorId]);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

const getClassManagement = async (req, res, next) => {
  try {
    const class_id = req.session.class_id;
    const result = await pool.query("SELECT student_id, name FROM enrollment JOIN student USING (student_id) WHERE class_id = $1", [class_id]);
    const classData = result.rows;

    const examResults = classData.map(student =>
      pool.query("SELECT exam_id, grade FROM studentResults WHERE student_id = $1", [student.student_id])
      .then(result => ({
        student_id: student.student_id,
        name: student.name,
        exams: result.rows,
      }))
    );

    const combinedResults = await Promise.all(examResults);

    const courseQuery = await pool.query("SELECT course_id, course_name FROM classes WHERE class_id = $1", [class_id]);
    const courseDetails = courseQuery.rows;

    res.json({ studentInfo: combinedResults, courseDetails });
  } catch (err) {
    next(err);
  }
};

module.exports = { getClassInfo, getClassManagement };
