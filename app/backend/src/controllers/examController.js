const pool = require("../utils/db");

// Save solution questions and answers
const saveQuestions = async (req, res, next) => {
  const { questions, classID, examTitle, numQuestions, markingSchemes = {} } = req.body;

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
      "INSERT INTO solution (exam_id, answers, marking_schemes) VALUES ($1, $2, $3)",
      [insertedRowId, questionsArray, JSON.stringify(markingSchemes)]
    );

    res.status(200).json({ message: 'Questions and marking schemes saved successfully.' });
  } catch (error) {
    console.error("Error saving questions and marking schemes: ", error);
    res.status(500).json({ message: 'Failed to save questions and marking schemes.' });
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
    const answersInOrder = answersArray.map(answer => answer.split(':')[1]);

    return answersInOrder;
  } catch (error) {
    console.error("Error getting answer key for exam:", error);
    throw error;
  }
};

async function getCustomMarkingSchemes(exam_id) {
  const result = await pool.query('SELECT marking_schemes FROM solution WHERE exam_id = $1', [exam_id]);

  if (result.rows.length === 0) {
    throw new Error(`No marking schemes found for exam_id ${exam_id}`);
  }

  const customMarkingSchemes = result.rows[0].marking_schemes;

  const transformedSchemes = {};
  customMarkingSchemes.forEach((scheme, index) => {
    const schemeName = `SCHEME_${index + 1}`;
    transformedSchemes[schemeName] = {
      questions: scheme.questions,
      marking: {
        correct: scheme.correct,
        incorrect: scheme.incorrect,
        unmarked: scheme.unmarked,
      },
    };
  });

  return transformedSchemes;
}

module.exports = {
  saveQuestions,
  newExam,
  examBoard,
  getAnswerKeyForExam,
  getAveragePerExam,
  getAveragePerCourse,
  getStudentGrades,
  getCustomMarkingSchemes,
};
