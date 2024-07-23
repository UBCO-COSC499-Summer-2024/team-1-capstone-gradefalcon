const pool = require("../utils/db");

const saveQuestions = async (req, res, next) => {
  const questions = req.body.questions; // Assuming questions is an array of question objects
  const classID = req.body.classID;
  const examTitle = req.body.examTitle;
  const numQuestions = req.body.numQuestions;

  const questionsArray = Object.entries(questions).map(
    ([key, value]) => `${value.question}:${value.option}`
  );

  try {
    const writeToExam = await pool.query(
      "INSERT INTO exam (class_id, exam_title, total_questions, total_marks) VALUES ($1, $2, $3, 10) RETURNING exam_id",
      [classID, examTitle, numQuestions]
    );
    const insertedRowId = writeToExam.rows[0].exam_id;
    const writeToSolution = await pool.query(
      "INSERT INTO solution (exam_id, answers) VALUES ($1, $2)",
      [insertedRowId, questionsArray]
    );
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

const newExam = async (req, res, next) => {
  const { exam_id, student_id, grade } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO studentResults (exam_id, student_id, grade) VALUES ($1, $2, $3) RETURNING *",
      [exam_id, student_id, grade]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const examBoard = async (req, res, next) => {
  const instructorId = req.auth.payload.sub; // Get the instructor ID from Auth0 token
  try {
    const classes = await pool.query(
      "SELECT exam_id, classes.class_id, exam_title, course_id, course_name FROM exam RIGHT JOIN classes ON (exam.class_id = classes.class_id) WHERE instructor_id = $1 ",
      [instructorId]
    );

    res.json({ classes: classes.rows });
  } catch (err) {
    next(err);
  }
};

const getStandardAverageData = async (req, res, next) => {
  const instructorId = req.auth.payload.sub; // Get the instructor ID from Auth0 token
  try {
    const standardAverageData = await pool.query(`
      SELECT e.exam_title AS "examTitle", AVG(sr.grade) AS "averageScore"
      FROM studentResults sr
      JOIN exam e ON sr.exam_id = e.exam_id
      JOIN classes c ON e.class_id = c.class_id
      WHERE c.instructor_id = $1
      GROUP BY e.exam_title
      ORDER BY e.exam_title
    `, [instructorId]);

    res.json(standardAverageData.rows);
  } catch (err) {
    next(err);
  }
};

const getPerformanceData = async (req, res, next) => {
  const instructorId = req.auth.payload.sub; // Get the instructor ID from Auth0 token
  try {
    const performanceData = await pool.query(`
      SELECT c.course_name AS "courseName", AVG(sr.grade) AS "averageScore"
      FROM studentResults sr
      JOIN exam e ON sr.exam_id = e.exam_id
      JOIN classes c ON e.class_id = c.class_id
      WHERE c.instructor_id = $1
      GROUP BY c.course_name
      ORDER BY c.course_name
    `, [instructorId]);

    res.json(performanceData.rows);
  } catch (err) {
    next(err);
  }
};

const getStudentGrades = async (req, res, next) => {
  const { studentId } = req.params;
  const { classId } = req.query; // Get the classId from the query parameters

  try {
    const result = await pool.query(`
      SELECT e.exam_title AS title, 
             CASE 
               WHEN sr.grade IS NULL THEN 'missing' 
               ELSE 'submitted' 
             END AS status, 
             COALESCE(sr.grade, 0) AS score, 
             e.total_marks AS total
      FROM exam e
      LEFT JOIN studentResults sr ON e.exam_id = sr.exam_id AND sr.student_id = $1
      WHERE e.class_id = $2
    `, [studentId, classId]);

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { saveQuestions, newExam, examBoard, getStandardAverageData, getPerformanceData, getStudentGrades };
