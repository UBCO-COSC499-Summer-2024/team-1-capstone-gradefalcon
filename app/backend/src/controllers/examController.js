const pool = require("../utils/db");
const fs = require("fs");
const path = require("path");

const saveQuestions = async (req, res, next) => {
  const { questions, classID, examTitle, numQuestions, totalMarks, markingSchemes = {}, canViewExam, canViewAnswers } = req.body;

  const questionsArray = Object.entries(questions).map(([key, value]) => `${value.question}:${value.option}`);

  try {
    const writeToExam = await pool.query(
      "INSERT INTO exam (class_id, exam_title, total_questions, total_marks, viewing_options) VALUES ($1, $2, $3, $4, $5) RETURNING exam_id",
      [classID, examTitle, numQuestions, totalMarks, JSON.stringify({ canViewExam: canViewExam, canViewAnswers: canViewAnswers })]
    );
    const insertedRowId = writeToExam.rows[0].exam_id;

    const writeToSolution = await pool.query("INSERT INTO solution (exam_id, answers, marking_schemes) VALUES ($1, $2, $3)", [
      insertedRowId,
      questionsArray,
      JSON.stringify(markingSchemes),
    ]);

    res.status(200).json({ message: "Questions and marking schemes saved successfully." });
  } catch (error) {
    console.error("Error saving questions and marking schemes: ", error);
    res.status(500).json({ message: "Failed to save questions and marking schemes." });
  }
};

// New exam route
const newExam = async (req, res, next) => {
  const { exam_id, student_id, grade } = req.body;

  try {
    const result = await pool.query("INSERT INTO studentResults (exam_id, student_id, grade) VALUES ($1, $2, $3) RETURNING *", [
      exam_id,
      student_id,
      grade,
    ]);
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const examBoard = async (req, res, next) => {
  const instructorId = req.auth.sub; // Get the instructor ID from Auth0 token
  try {
    const classes = await pool.query(
      "SELECT exam_id, classes.class_id, exam_title, course_id, course_name, graded FROM exam RIGHT JOIN classes ON (exam.class_id = classes.class_id) WHERE instructor_id = $1 ",
      [instructorId]
    );

    res.json({ classes: classes.rows });
  } catch (err) {
    next(err);
  }
};

const getAveragePerExam = async (req, res, next) => {
  const instructorId = req.auth.sub; // Get the instructor ID from Auth0 token
  try {
    const averagePerExamData = await pool.query(
      `
      SELECT e.exam_title AS "examTitle", ROUND(AVG(sr.grade)::numeric, 1) AS "averageScore"
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
  const instructorId = req.auth.sub;
  try {
    const averagePerCourseData = await pool.query(
      `
      SELECT c.course_name AS "courseName", ROUND(AVG(sr.grade)::numeric, 1) AS "averageScore"
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
    const solutionResult = await pool.query("SELECT answers FROM solution WHERE exam_id = $1", [exam_id]);

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
    if (studentId === "") {
      return "Unknown student";
    }
    const result = await pool.query("SELECT name FROM student WHERE student_id = $1", [studentId]);

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

const getExamType = async (exam_id) => {
  try {
    const result = await pool.query("SELECT total_questions FROM exam WHERE exam_id = $1", [exam_id]);

    if (result.rows.length === 0) {
      return "No scores found for this exam";
    }

    const totalQuestions = result.rows[0].total_questions;
    return totalQuestions > 100 ? "200mcq" : "100mcq";
  } catch (error) {
    console.error("Error getting scores by exam ID:", error);
    throw error;
  }
};

const getScoreByExamId = async (exam_id) => {
  try {
    const result = await pool.query("SELECT total_marks FROM exam WHERE exam_id = $1", [exam_id]);

    if (result.rows.length === 0) {
      return "No scores found for this exam";
    }
    console.log(result.rows.map((row) => row.total_marks));
    return result.rows.map((row) => row.total_marks);
  } catch (error) {
    console.error("Error getting scores by exam ID:", error);
    throw error;
  }
};

const changeGrade = async (req, res, next) => {
  try {
    const result = await pool.query("UPDATE studentResults SET grade = $1 WHERE student_id = $2 AND exam_id = $3", [
      req.body.grade,
      req.body.student_id,
      req.body.exam_id,
    ]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Student or exam not found" });
    }
    res.status(200).json({ message: "Grade updated successfully" });
  } catch (error) {
    console.error("Error changing grade:", error);
    next(error);
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
        const result = await pool.query("INSERT INTO studentresults (student_id, exam_id, grade) VALUES ($1,$2,$3)", [
          score.StudentID,
          exam_id,
          parseInt(score.Score, 10),
        ]);
      }
    }
    // Update the "graded" status in the exams table
    await pool.query("UPDATE exam SET graded = true WHERE exam_id = $1", [exam_id]);

    res.send({ message: "Scores saved successfully" });
    resetOMR();
  } catch (error) {
    console.error("Error saving student scores:", error);
    res.status(500).send("Error saving scores");
  }
};

const ensureDirectoryExistence = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const resetOMR = () => {
  deleteAllFilesInDir(path.join(__dirname, "../../omr/inputs"));
  deleteAllFilesInDir(path.join(__dirname, "../../omr/outputs"));
  return true;
};

// Function to delete all files in a directory
const deleteAllFilesInDir = (dirPath) => {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${dirPath}:`, err);
      return;
    }

    files.forEach((file) => {
      const fileToDelete = path.join(dirPath, file);
      fs.stat(fileToDelete, (err, stats) => {
        if (err) {
          console.error(`Error stating file ${fileToDelete}:`, err);
          return;
        }

        if (stats.isFile()) {
          fs.unlink(fileToDelete, (err) => {
            if (err) {
              console.error(`Error deleting file ${fileToDelete}:`, err);
            } else {
              console.log(`File ${fileToDelete} deleted successfully`);
            }
          });
        } else if (stats.isDirectory()) {
          fs.rmdir(fileToDelete, { recursive: true }, (err) => {
            if (err) {
              console.error(`Error deleting directory ${fileToDelete}:`, err);
            } else {
              console.log(`Directory ${fileToDelete} deleted successfully`);
            }
          });
        }
      });
    });
  });
};

async function getCustomMarkingSchemes(exam_id) {
  const result = await pool.query("SELECT marking_schemes FROM solution WHERE exam_id = $1", [exam_id]);

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

// Fetch exam details by exam_id
const getExamDetails = async (req, res, next) => {
  const { exam_id } = req.params;

  try {
    const examQuery = `
      SELECT e.exam_id, e.exam_title, e.total_questions, e.total_marks, e.mean, e.high, e.low, 
      e.upper_quartile, e.lower_quartile, e.page_count, e.viewing_options, graded,
      c.course_id, c.course_name
      FROM exam e
      JOIN classes c ON e.class_id = c.class_id
      WHERE e.exam_id = $1
    `;
    const examResult = await pool.query(examQuery, [exam_id]);

    if (examResult.rows.length === 0) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const ExamDetails = examResult.rows[0];

    const studentResultsQuery = `
      SELECT sr.student_id, s.name as student_name, sr.grade
      FROM studentResults sr
      JOIN student s ON sr.student_id = s.student_id
      WHERE sr.exam_id = $1
    `;
    const studentResultsResult = await pool.query(studentResultsQuery, [exam_id]);

    ExamDetails.studentResults = studentResultsResult.rows;

    res.json(ExamDetails);
  } catch (error) {
    console.error("Error fetching exam details:", error);
    res.status(500).json({ message: "Failed to fetch exam details" });
  }
};

const getStudentExams = async (req, res, next) => {
  const studentId = req.auth.sub; // Get the student ID from Auth0 token

  try {
    const exams = await pool.query(
      `
      select exam_id, exam_title, course_id, course_name, graded from exam 
	    join classes using (class_id)
      join enrollment using (class_id)
      join student using (student_id)
      where auth0_id = $1
    `,
      [studentId]
    );

    res.json({ exams: exams.rows });
  } catch (err) {
    console.error("Error fetching student exams:", err);
    next(err);
  }
};

const getStudentAttempt = async (req, res, next) => {
  const studentId = req.auth.sub; // Get the student ID from Auth0 token
  const examId = parseInt(req.params.exam_id, 10);

  try {
    const exam = await pool.query(
      `
      SELECT exam_id, student_id, grade, exam_title, course_id, course_name, viewing_options 
      from studentResults 
      join student using (student_id) 
	    join exam using (exam_id)
	    join classes using (class_id)
      where auth0_id = $1 and exam_id = $2
    `,
      [studentId, examId]
    );
    res.json({ exam: exam.rows[0] });
  } catch (err) {
    console.error("Error fetching student exams:", err);
    next(err);
  }
};

const fetchStudentExam = async (req, res, next) => {
  const auth0_id = req.auth.sub; // Get the student ID from Auth0 token
  const exam_id = parseInt(req.params.exam_id, 10);
  const file_name = req.body.page;
  console.log("file_name", file_name);
  try {
    const exams = await pool.query(
      `
      SELECT student_id
      FROM student
      WHERE auth0_id = $1
    `,
      [auth0_id]
    );
    const student_id = exams.rows[0].student_id;
    const folderPath = path.join(__dirname, `../../uploads/Students/exam_id_${exam_id}/student_id_${student_id}/${file_name}`);
    console.log("folderPath", folderPath);
    res.sendFile(folderPath);
  } catch (err) {
    console.error("Error fetching student exams:", err);
    next(err);
  }
};

const fetchSolution = async (req, res, next) => {
  const exam_id = req.params.exam_id;
  try {
    const solutionResult = await pool.query("SELECT answers FROM solution WHERE exam_id = $1", [exam_id]);

    if (solutionResult.rows.length === 0) {
      throw new Error("Solution not found");
    }

    const answersArray = solutionResult.rows[0].answers; // This should be a JSON array

    // Extract the answers in order
    const answersInOrder = answersArray.map((answer) => answer.split(":")[1]);

    res.json(answersInOrder);
  } catch (error) {
    console.error("Error fetching solution:", error);
    res.status(500).json({ message: "Failed to fetch solution" });
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
  getAnswerKeyForExam,
  getStudentNameById,
  getScoreByExamId,
  saveResults,
  getExamType,
  deleteAllFilesInDir,
  resetOMR,
  ensureDirectoryExistence,
  getCustomMarkingSchemes,
  getExamDetails,
  getStudentExams,
  getStudentAttempt,
  fetchStudentExam,
  fetchSolution,
  changeGrade,
};
