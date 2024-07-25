const pool = require("../utils/db");

// Save solution questions and answers
const saveQuestions = async (req, res, next) => {
  const questions = req.body.questions;
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

const getAveragePerExam = async (req, res, next) => {
  const instructorId = req.session.userId;
  try {
    const averagePerExamData = await pool.query(
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

    res.json(averagePerExamData.rows);
  } catch (err) {
    next(err);
  }
};

const getAveragePerCourse = async (req, res, next) => {
  const instructorId = req.session.userId;
  try {
    const averagePerCourseData = await pool.query(
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

    res.json(averagePerCourseData.rows);
  } catch (err) {
    next(err);
  }
};

const getStudentGrades = async (req, res, next) => {
  const { studentId } = req.params;
  const { classId } = req.query;

  try {
    const result = await pool.query(
      `
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
    `,
      [studentId, classId]
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

const getAnswerKeyForExam = async (exam_id) => {
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
    const answersInOrder = answersArray.map((answer) => answer.split(":")[1]);

    return answersInOrder;
  } catch (error) {
    console.error("Error getting answer key for exam:", error);
    throw error;
  }
};

const getStudentNameById = async (studentId) => {
  try {
    const result = await pool.query(
      "SELECT name FROM student WHERE student_id = $1",
      [studentId]
    );

    if (result.rows.length === 0) {
      // throw new Error("Student not found");
      return "Unknown student";
    }

    return result.rows[0].name;
  } catch (error) {
    console.error("Error getting student name by ID:", error);
    throw error;
  }
};

const getScoreByExamId = async (exam_id) => {
  try {
    const result = await pool.query(
      "SELECT total_marks FROM exam WHERE exam_id = $1",
      [exam_id]
    );

    if (result.rows.length === 0) {
      return "No scores found for this exam";
    }

    return result.rows.map((row) => row.total_marks);
  } catch (error) {
    console.error("Error getting scores by exam ID:", error);
    throw error;
  }
};

const saveResults = async (req, res, next) => {
  const { studentScores, exam_id } = req.body;
  console.log(studentScores);
  console.log(exam_id);

  try {
    // Assuming you have a database connection established and a model for studentResults
    for (const score of studentScores) {
      if (score.StudentName !== "Unknown student") {
        // Assuming studentResults is your table/model name and it has a method to insert data
        const result = await pool.query(
          "INSERT INTO studentresults (student_id, exam_id, grade) VALUES ($1,$2,$3)",
          [score.StudentID, exam_id, score.Score]
        );
      }
    }
    res.send({ message: "Scores saved successfully" });
  } catch (error) {
    console.error("Error saving student scores:", error);
    res.status(500).send("Error saving scores");
  }
};

module.exports = {
  saveQuestions,
  newExam,
  examBoard,
  getAnswerKeyForExam,
  getAveragePerExam,
  getAveragePerCourse,
  getStudentGrades,
  getStandardAverageData,
  getPerformanceData,
  getAnswerKeyForExam,
  getStudentNameById,
  getScoreByExamId,
  saveResults,
};
