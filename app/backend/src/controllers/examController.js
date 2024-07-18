const pool = require("../utils/db");

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

// New function to get standard average data
const getStandardAverageData = async (req, res, next) => {
  const instructorId = req.session.userId;
  try {
    const standardAverageData = await pool.query(
      `
      SELECT e.exam_title AS "examTitle", AVG(sr.grade) AS "averageScore"
      FROM studentResults sr
      JOIN exam e ON sr.exam_id = e.exam_id
      JOIN classes c ON e.class_id = c.class_id
      WHERE c.instructor_id = $1
      GROUP BY e.exam_title
      ORDER BY e.exam_title
    `,
      [instructorId]
    );

    res.json(standardAverageData.rows);
  } catch (err) {
    next(err);
  }
};

// New function to get performance data
const getPerformanceData = async (req, res, next) => {
  const instructorId = req.session.userId;
  try {
    const performanceData = await pool.query(
      `
      SELECT c.course_name AS "courseName", AVG(sr.grade) AS "averageScore"
      FROM studentResults sr
      JOIN exam e ON sr.exam_id = e.exam_id
      JOIN classes c ON e.class_id = c.class_id
      WHERE c.instructor_id = $1
      GROUP BY c.course_name
      ORDER BY c.course_name
    `,
      [instructorId]
    );

    res.json(performanceData.rows);
  } catch (err) {
    next(err);
  }
};


const getAnswerKeyForExam = async (exam_id) => {
  console.log("getAnswerKeyForExam called with exam_id:", exam_id); // Log the exam_id
  if (!Number.isInteger(exam_id)) {
    throw new Error("Invalid exam_id");
  }

  try {
    const solutionResult = await pool.query(
      "SELECT answers FROM solution WHERE exam_id = $1",
      [exam_id]
    );
    if (solutionResult.rows.length === 0) {
      throw new Error("Solution not found");
    }

    const answersArray = solutionResult.rows[0].answers; // This should be a JSON array

    // Extract the answers in order
    const answersInOrder = [];
    for (let i = 0; i < answersArray.length; i++) {
      answersInOrder.push(answersArray[i]);
    }

    return answersInOrder;
  } catch (error) {
    console.error("Error getting answer key for exam:", error);
    throw error;
  }
};


module.exports = {
  saveQuestions,
  newExam,
  examBoard,
  getStandardAverageData,
  getPerformanceData,
  getAnswerKeyForExam
};
