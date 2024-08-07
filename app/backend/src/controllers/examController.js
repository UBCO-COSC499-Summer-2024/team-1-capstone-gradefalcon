const pool = require("../utils/db");
const fs = require("fs");
const path = require("path");
const { exec } = require('child_process');

const saveQuestions = async (req, res, next) => {
  const { questions, classID, examTitle, numQuestions, totalMarks, markingSchemes, template, canViewExam, canViewAnswers } = req.body;

  console.log("Received data:", {
    questions,
    classID,
    examTitle,
    numQuestions,
    totalMarks,
    markingSchemes,
    template,
    canViewExam,
    canViewAnswers,
  });

  const questionsArray = Object.entries(questions).map(([key, value]) => `${value.question}:${value.option}`);

  try {
    const writeToExam = await pool.query(
      "INSERT INTO exam (class_id, exam_title, total_questions, total_marks, template, viewing_options) VALUES ($1, $2, $3, $4, $5, $6) RETURNING exam_id",
      [classID, examTitle, numQuestions, totalMarks, template, JSON.stringify({ canViewExam: canViewExam, canViewAnswers: canViewAnswers })]
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


//get Total Questions and Exam type (formally named getExamType)
const getExamQuestionDetails = async (req, res) => {
  const { exam_id } = req.params;

  try {
    const result = await pool.query(
      "SELECT total_questions, template FROM exam WHERE exam_id = $1",
      [exam_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No scores found for this exam" });
    }

    const { total_questions: totalQuestions, template: examType } = result.rows[0];

    return res.status(200).json({
      totalQuestions,
      examType,
    });
  } catch (error) {
    console.error("Error getting exam question details:", error);
    return res.status(500).json({ message: "Internal Server Error" });
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
    // Retrieve the current grade
    const currentGradeResult = await pool.query("SELECT grade FROM studentResults WHERE student_id = $1 AND exam_id = $2", [
      req.body.student_id,
      req.body.exam_id,
    ]);

    if (currentGradeResult.rowCount === 0) {
      return res.status(404).json({ message: "Student or exam not found" });
    }

    const currentGrade = currentGradeResult.rows[0].grade;

    // Update the grade and append to changelog
    const result = await pool.query(
      "UPDATE studentResults SET grade = $1, grade_changelog = array_append(grade_changelog, $2) WHERE student_id = $3 AND exam_id = $4",
      [req.body.grade, `Grade was changed from ${currentGrade} to ${req.body.grade}`, req.body.student_id, req.body.exam_id]
    );

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
        // Extract fields starting with 'q' and store them in an array
        const questionFields = Object.keys(score)
          .filter((key) => key.startsWith("q") && score[key].trim() !== "")
          .map((key) => ({ [key]: score[key] }));

        // Convert the array to a JSON string
        const questionFieldsJson = JSON.stringify(questionFields);
        console.log("questionFieldsJson", questionFieldsJson);
        // Assuming studentResults is your table/model name and it has a method to insert data
        const result = await pool.query(
          "INSERT INTO studentresults (student_id, exam_id, grade, chosen_answers) VALUES ($1, $2, $3, $4)",
          [score.StudentID, exam_id, parseInt(score.Score, 10), questionFieldsJson]
        );
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

//helper function to generate the latex document
async function generateLatexDocument(questions, options, courseId, examTitle) {
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
       \\Large{\\textbf{${courseId}: ${examTitle}}}
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

async function generateCustomJsonTemplate(questions, options, courseId, examTitle, classId) {
  const columns = 4; // Number of columns in the template
  const questionsPerPage = 100; // Questions per page threshold
  const pages = questions > questionsPerPage ? 2 : 1; // Determine if the exam will span 1 or 2 pages

  for (let page = 1; page <= pages; page++) {
    const currentPageQuestions = page === 1
      ? Math.min(questions, questionsPerPage)
      : questions - questionsPerPage;

    const baseQuestionsPerColumn = Math.ceil(currentPageQuestions / columns); // Base number of questions per column
    const remainder = currentPageQuestions % columns; // Questions that won't be evenly distributed
    const lastColumnQuestions = remainder === 0 ? baseQuestionsPerColumn : currentPageQuestions - (baseQuestionsPerColumn * (columns - 1));

    let template = {
      templateDimensions: [950, 1250],
      bubbleDimensions: [26, 26],
      fieldBlocks: {},
      preProcessors: [
        {
          name: "BorderPreprocessor",
          options: {
            border_size: 2,
            border_color: [0, 0, 0],
          },
        },
      ],
    };

        // Add Student ID block and custom label to the first page
        if (page === 1) {
          template.customLabels = {
            StudentID: ["roll1..8"]
          };
          template.fieldBlocks.StudentID = {
            fieldType: "QTYPE_ID",
            origin: [363, 169],
            fieldLabels: ["roll1..8"],
            bubblesGap: 31,
            labelsGap: 22,
          };
        }
    

    let startQuestion = page === 1 ? 1 : 101;

    for (let col = 1; col <= columns; col++) {
      let questionsInThisColumn;

      if (col < columns) {
        questionsInThisColumn = baseQuestionsPerColumn;
      } else {
        questionsInThisColumn = lastColumnQuestions;
      }

      const endQuestion = startQuestion + questionsInThisColumn - 1;

      let labels = [];
      for (let q = startQuestion; q <= endQuestion; q++) {
        labels.push(`q${q}`);
      }

      if (labels.length > 0) {
        template.fieldBlocks[`MCQBlock${col}`] = {
          fieldType: `QTYPE_MCQ${options}`,
          origin: calculateOrigin(col, page), // Custom function to determine origin
          fieldLabels: labels,
          bubblesGap: options === 4 ? 24.9 : 20, // Adjust bubble gap for different options
          labelsGap: 29.7,
        };
      }

      startQuestion = endQuestion + 1; // Update the start question for the next column
    }

    // Save the template to a separate file for each page
    const outputDir = path.join(__dirname, '../assets/custom', `${courseId}_${examTitle}_${classId}`);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const jsonFilePath = path.join(outputDir, `custom_page_${page}.json`);
    fs.writeFileSync(jsonFilePath, JSON.stringify(template, null, 2));
  }
}

function calculateOrigin(column, page) {
  // Define fixed origins based on column and page
  const originsPage1 = [
    [160, 395],
    [350, 395],
    [540, 395],
    [730, 395],
  ];
  const originsPage2 = [
    [160, 19],
    [350, 19],
    [540, 19],
    [730, 19],
  ];

  if (page === 1) {
    return originsPage1[column - 1];
  } else if (page === 2) {
    return originsPage2[column - 1];
  }
}


async function generateCustomBubbleSheet(req, res) {
  const { numQuestions, numOptions, courseId, examTitle, classId } = req.body;

  if (!numQuestions || !numOptions || !courseId || !examTitle || !classId) {
    return res.status(400).send("Missing number of questions, options, courseId, examTitle, or classId.");
  }

  // Create the directory if it doesn't exist
  const outputDir = path.join(__dirname, '../assets/custom', `${courseId}_${examTitle}_${classId}`);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate LaTeX document and save to file
  const latexDocument = await generateLatexDocument(numQuestions, numOptions, courseId, examTitle);
  const latexFilePath = path.join(outputDir, `${courseId}_${examTitle}_${classId}.tex`);
  const pdfFilePath = path.join(outputDir, `${courseId}_${examTitle}_${classId}.pdf`);

  fs.writeFileSync(latexFilePath, latexDocument);

  // Generate and save JSON templates
  await generateCustomJsonTemplate(numQuestions, numOptions, courseId, examTitle, classId);

  // Compile the LaTeX file into a PDF
  exec(`pdflatex -output-directory=${outputDir} ${latexFilePath}`, (error, stdout, stderr) => {
    if (error) {
      console.error('Error compiling LaTeX:', stderr);
      return res.status(500).send("Failed to generate PDF.");
    }

    // Set response headers and stream the PDF file
    res.setHeader('Content-Disposition', `attachment; filename="${courseId}_${examTitle}_${classId}.pdf"`);
    res.setHeader('Content-Type', 'application/pdf');
    const pdfStream = fs.createReadStream(pdfFilePath);
    pdfStream.pipe(res);

    // Clean up auxiliary files after the PDF has been sent
    pdfStream.on('close', () => {
      const auxFilePath = path.join(outputDir, `${courseId}_${examTitle}_${classId}.aux`);
      const logFilePath = path.join(outputDir, `${courseId}_${examTitle}_${classId}.log`);

      fs.unlink(auxFilePath, (err) => {
        if (err) console.error(`Error deleting ${auxFilePath}:`, err);
      });
      fs.unlink(logFilePath, (err) => {
        if (err) console.error(`Error deleting ${logFilePath}:`, err);
      });
      fs.unlink(latexFilePath, (err) => {
        if (err) console.error(`Error deleting ${latexFilePath}:`, err);
      });
    });
  });
}


// Fetch exam details by exam_id
const getExamDetails = async (req, res, next) => {
  const { exam_id } = req.params;

  try {
    const examQuery = `
      SELECT e.exam_id, e.exam_title, e.total_questions, e.total_marks, e.mean, e.high, e.low, 
      e.upper_quartile, e.lower_quartile, e.page_count, e.viewing_options, graded,
      c.course_id, c.course_name, e.class_id
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
    SELECT sr.student_id, s.name as student_name, sr.grade, sr.chosen_answers
    FROM studentResults sr
    JOIN student s ON sr.student_id = s.student_id
    WHERE sr.exam_id = $1
  `;
    const studentResultsResult = await pool.query(studentResultsQuery, [exam_id]);

    ExamDetails.studentResults = studentResultsResult.rows;

    // Calculate percentage of students who selected each response
    const questionStats = {};
    studentResultsResult.rows.forEach(result => {
      const chosenAnswers = result.chosen_answers;
      chosenAnswers.forEach(answer => {
        const question = Object.keys(answer)[0];
        const response = answer[question];
        
        if (!questionStats[question]) {
          questionStats[question] = {};
        }
        if (!questionStats[question][response]) {
          questionStats[question][response] = 0;
        }
        questionStats[question][response] += 1;
      });
    });

    const totalStudents = studentResultsResult.rows.length;
    for (const question in questionStats) {
      for (const response in questionStats[question]) {
        questionStats[question][response] = (questionStats[question][response] / totalStudents) * 100;
      }
    }

    ExamDetails.questionStats = questionStats;
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

const getGradeChangeLog = async (req, res, next) => {
  const { student_id, exam_id } = req.body;
  console.log(student_id, exam_id);
  try {
    const result = await pool.query("SELECT grade_changelog FROM studentResults WHERE student_id = $1 AND exam_id = $2", [
      student_id,
      exam_id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Student or exam not found" });
    }

    res.json({ grade_changelog: result.rows[0].grade_changelog });
  } catch (error) {
    console.error("Error fetching grade changelog:", error);
    next(error);
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
  getExamQuestionDetails,
  deleteAllFilesInDir,
  resetOMR,
  ensureDirectoryExistence,
  getCustomMarkingSchemes,
  generateCustomBubbleSheet,
  getExamDetails,
  getStudentExams,
  getStudentAttempt,
  fetchStudentExam,
  fetchSolution,
  changeGrade,
  getGradeChangeLog,
};
