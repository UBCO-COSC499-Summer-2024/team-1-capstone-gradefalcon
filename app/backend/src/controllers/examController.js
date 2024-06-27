const pool = require('../utils/db');

// Save solution questions and answers
const saveQuestions = async (req, res, next) => {
  const questions = req.body.questions; // Assuming questions is an array of question objects
  const classID = req.body.classID;
  const examTitle = req.body.examTitle;
  const numQuestions = req.body.numQuestions;

  // Convert the questions dictionary into an array of strings
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

// New exam route
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

// Display classes and their exams
const examBoard = async (req, res, next) => {
  const instructorId = req.session.userId;
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

module.exports = { saveQuestions, newExam, examBoard };
