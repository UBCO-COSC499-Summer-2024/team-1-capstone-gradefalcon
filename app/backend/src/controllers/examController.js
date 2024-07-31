const pool = require("../utils/db");
const fs = require("fs");
const path = require("path");
const { exec } = require('child_process');

const saveQuestions = async (req, res, next) => {
  const { questions, classID, examTitle, numQuestions, totalMarks, markingSchemes = {} } = req.body;

  const questionsArray = Object.entries(questions).map(
    ([key, value]) => `${value.question}:${value.option}`
  );

  try {
    const writeToExam = await pool.query(
      "INSERT INTO exam (class_id, exam_title, total_questions, total_marks) VALUES ($1, $2, $3, $4) RETURNING exam_id",
      [classID, examTitle, numQuestions, totalMarks]
    );
    const insertedRowId = writeToExam.rows[0].exam_id;

    const writeToSolution = await pool.query(
      "INSERT INTO solution (exam_id, answers, marking_schemes) VALUES ($1, $2, $3)",
      [insertedRowId, questionsArray, JSON.stringify(markingSchemes)]
    );

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
  const instructorId = req.auth.sub; // Get the instructor ID from Auth0 token
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
  const instructorId = req.auth.sub; // Get the instructor ID from Auth0 token
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
  const instructorId = req.auth.sub;
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
    const solutionResult = await pool.query("SELECT answers FROM solution WHERE exam_id = $1", [
      exam_id,
    ]);

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
    const result = await pool.query("SELECT total_questions FROM exam WHERE exam_id = $1", [
      exam_id,
    ]);

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
          [score.StudentID, exam_id, parseInt(score.Score, 10)]
        );
      }
    }
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
  const result = await pool.query("SELECT marking_schemes FROM solution WHERE exam_id = $1", [
    exam_id,
  ]);

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

async function generateLatexDocument(questions, options) {
  const questionTemplate = `
    \\noindent
    \\begin{minipage}[t]{\\linewidth}
    \\raggedleft
    \\textbf{\\n} \\hspace{0.1cm}
    \\begin{tikzpicture}[baseline=-0.5ex]
      ${Array.from({ length: options }, (_, i) => `
        \\node at (${i + 1}*0.6,0) {\\scriptsize ${String.fromCharCode(65 + i)}};
        \\draw (${i + 1}*0.6,0) circle (0.2);
      `).join('')}
    \\end{tikzpicture}
    \\vspace{0.25cm}
    \\end{minipage}
  `;

  return `
    \\documentclass{article}
    \\usepackage[utf8]{inputenc}
    \\usepackage{helvet}
    \\renewcommand{\\familydefault}{\\sfdefault}
    \\usepackage{tikz}
    \\usepackage[margin=1in]{geometry}
    \\usepackage{multicol}
    \\usepackage{pgffor}
    \\usepackage{graphicx}
    \\usepackage{geometry}
    \\geometry{
      a4paper,
      total={170mm,257mm},
      left=20mm,
      top=5mm,
    }
    \\newcommand*\\cir[1]{\\tikz[baseline=(char.base)]{
                \\node[shape=circle,draw,inner sep=2.2pt] (char) {#1};}}
    \\begin{document}
    \\begin{center}
        \\Large{\\textbf{Answer sheet}}
    \\end{center}
    \\textit{Please follow the directions on the exam question sheet. Fill in the entire circle that corresponds to your answer for each question on the exam. Erase marks completely to make a change.}
    \\vspace{5mm}
    \\begin{center}
    \\begin{tabular}{ c c c c c c c c c c }
    \\hspace{24mm}0 &  \\hspace{.85mm}1 & \\hspace{.85mm}2 & \\hspace{0.85mm}3 & \\hspace{0.85mm}4 &\\hspace{.85mm}5 & \\hspace{.85mm}6 &\\hspace{.85mm}7 &\\hspace{.85mm}8 &\\hspace{.85mm}9 \\\\    
    \\end{tabular}
    \\end{center}
    Student I.D.\\\\
    \\begin{tabular}{@{}l@{\\hspace*{0.5cm}}c@{\\hspace*{0.3cm}} c@{\\hspace*{0.3cm}} c @ {\\hspace*{0.3cm}}c @ {\\hspace*{0.3cm}}c @ {\\hspace*{0.3cm}}c @ {\\hspace*{0.3cm}}c @ {\\hspace*{0.3cm}}c @ {\\hspace*{0.3cm}}c @ {\\hspace*{0.3cm}}c @ {\\hspace*{0.3cm}}c @{}}
    ${Array.from({ length: 8 }, () => `
    \\vspace{1mm}\\hspace{46mm}\\rule{0.6cm}{0.2pt}\\hspace{0.4cm} & \\cir{\\tiny0} & \\cir{\\tiny1} & \\cir{\\tiny2} & \\cir{\\tiny3} & \\cir{\\tiny4} & \\cir{\\tiny5} & \\cir{\\tiny6} & \\cir{\\tiny7} & \\cir{\\tiny8} & \\cir{\\tiny9} \\\\  
    `).join('')}
    \\end{tabular}
    \\vspace{1cm}
    \\begin{center}
    \\begin{multicols}{4}
        \\foreach \\n in {1,2,...,${questions}} {
            ${questionTemplate}
        }
    \\end{multicols}
    \\end{center}
    \\end{document}
  `;
}
async function generateCustomBubbleSheet(req, res) {
  const { numQuestions, numOptions } = req.body;

  if (!numQuestions || !numOptions) {
    return res.status(400).send("Missing number of questions or options.");
  }

  const latexDocument = await generateLatexDocument(numQuestions, numOptions);
  const latexFilePath = path.join(__dirname, '../assets/bubble_sheet.tex');
  const pdfFilePath = path.join(__dirname, '../assets/bubble_sheet.pdf');

  fs.writeFileSync(latexFilePath, latexDocument);

  exec(`pdflatex -output-directory=${path.join(__dirname, '../assets')} ${latexFilePath}`, (error, stdout, stderr) => {
    if (error) {
      console.error('Error compiling LaTeX:', stderr);
      return res.status(500).send("Failed to generate PDF.");
    }

    res.setHeader('Content-Disposition', 'attachment; filename="custom_bubble_sheet.pdf"');
    res.setHeader('Content-Type', 'application/pdf');
    fs.createReadStream(pdfFilePath).pipe(res);
  });
}


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
  generateCustomBubbleSheet,
};
