const express = require("express");
const {
  saveQuestions,
  newExam,
  examBoard,
  getAnswerKeyForExam,
  getAveragePerExam,
  getAveragePerCourse,
  getStudentGrades,
  getStudentNameById,
  getScoreByExamId,
  getExamQuestionDetails,
  saveResults,
  ensureDirectoryExistence,
  resetOMR,
  getCustomMarkingSchemes,
  generateCustomBubbleSheet,
  getExamDetails,
  getStudentExams,
  deleteAllFilesInDir,
  getStudentAttempt,
  fetchStudentExam,
  fetchSolution,
  changeGrade,
  getGradeChangeLog,
} = require("../controllers/examController");
const { createUploadMiddleware } = require("../middleware/uploadMiddleware");
const { checkJwt, checkPermissions, checkRole } = require("../auth0"); // Importing from auth.js
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { Parser } = require("json2csv");
const { PDFDocument } = require("pdf-lib");
const multer = require("multer");
const { formatWithOptions } = require("util");
const router = express.Router();
const combinedUpload = multer().fields([
  { name: 'examKey', maxCount: 1 },
  { name: 'numQuestions' },
  { name: 'examTitle' },
  { name: 'classID' },
  { name: 'template' }
]);

router.post("/saveQuestions", checkJwt, checkPermissions(['create:exam']), saveQuestions);
router.post("/NewExam", checkJwt, checkPermissions(['create:exam']), newExam);
router.post("/ExamBoard", checkJwt, checkPermissions(['read:exams']), examBoard);
router.get("/average-per-exam", checkJwt, checkPermissions(['read:examAverageData']), getAveragePerExam);
router.get("/average-per-course", checkJwt, checkPermissions(['read:courseAverageData']), getAveragePerCourse);
router.get('/grades/:studentId', checkJwt, checkPermissions(['read:grades']), getStudentGrades);
router.post("/generateCustomBubbleSheet", checkJwt, checkPermissions(['create:exam']), generateCustomBubbleSheet);  
router.get("/getExamDetails/:exam_id", checkJwt, checkPermissions(['read:exams']), getExamDetails);
router.get("/student/exams", checkJwt, checkPermissions(["read:exam_student"]), getStudentExams);
router.get("/getStudentAttempt/:exam_id", checkJwt, checkPermissions(["read:exam_student"]), getStudentAttempt);
router.get("/getExamQuestionDetails/:exam_id", checkJwt, checkPermissions(["read:exam"]), getExamQuestionDetails);


// Function to get the answer key for a specific exam

router.get("/getAnswerKey/:exam_id", async (req, res, next) => {
  try {
    const exam_id = parseInt(req.params.exam_id, 10);
    if (isNaN(exam_id)) {
      throw new Error("Invalid exam_id");
    }
    const answerKey = await getAnswerKeyForExam(exam_id);
    res.json({ answerKey });
  } catch (error) {
    console.error("Error in /getAnswerKey:", error);
    res.status(500).send("Error getting answer key");
  }
});

// Get the exam attempt for a given student
router.get("/getStudentAttempt/:exam_id", async (req, res, next) => {
  try {
    const exam_id = parseInt(req.params.exam_id, 10);
    if (isNaN(exam_id)) {
      throw new Error("Invalid exam_id");
    }
    const studentAttempt = await getStudentAttempt(exam_id);
    res.json({ studentAttempt });
  } catch (error) {
    console.error("Error in /getStudentAttempt:", error);
    res.status(500).send("Error getting student attempt");
  }
});

// Add this route to the examRoutes.js file

router.post("/studentScores", checkJwt, checkPermissions(["read:grades"]), async function (req, res) {
  const { examType, numQuestions } = req.body; // Get examType and numQuestions from the request body

  // Determine the correct file path based on examType and numQuestions
  const filePath = (examType === "custom" && numQuestions <= 100)
    ? path.join(__dirname, "../../omr/outputs/Results/Results.csv")
    : path.join(__dirname, "../../omr/outputs/combined.csv");

  const results = []; // Array to hold student number and score

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) =>
      results.push({
        StudentID: data.StudentID,
        Score: data.score,
        front_page: data.front_page_file_id,
        back_page: data.back_page_file_id,
      })
    ) // Extract only the student number (Roll) and score
    .on("end", async () => {
      try {
        // Map each result to include the student name
        const resultsWithNames = await Promise.all(
          results.map(async (result) => {
            const studentName = await getStudentNameById(result.StudentID); // Assuming this function exists and returns the student's name
            return { StudentName: studentName, ...result };
          })
        );

        res.json(resultsWithNames); // Send the data including student names as a response
      } catch (error) {
        console.error("Error fetching student names:", error);
        res.status(500).send("Error fetching student names");
      }
    })
    .on("error", (error) => {
      console.error("Error reading CSV file:", error);
      res.status(500).send("Error reading CSV file");
    });
});


router.post("/UploadExam/:examType/:numQuestions", checkJwt, checkPermissions(["upload:file"]), async function (req, res) {
  const { examType, numQuestions } = req.params;

  const upload = multer({ dest: "uploads/" }).single("examPages");

  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).send("Error uploading file.");
    }

    const { path: tempFilePath } = req.file;

    const destinationDir1 = "/code/omr/inputs/page_1";
    const destinationDir2 = "/code/omr/inputs/page_2";
    const singlePageDir = "/code/omr/inputs";

    try {
      const existingPdfBytes = fs.readFileSync(tempFilePath);
      const examsPDF = await PDFDocument.load(existingPdfBytes);
      const totalPages = examsPDF.getPageCount();
      console.log("Total pages:", totalPages);

      if ((examType === "custom" && numQuestions <= 100)) {
        // Handle 100mcq or custom templates with 100 or fewer questions (1 page)
        ensureDirectoryExistence(singlePageDir);
        const examBytes = await examsPDF.save();
        fs.writeFileSync(path.join(singlePageDir, "exam.pdf"), examBytes);
        res.json({ message: "Exam uploaded successfully with one page." });
      } else if (examType === "200mcq" || (examType === "custom" && numQuestions > 100) || examType === "100mcq") {
        // Handle 200mcq or custom templates with more than 100 questions (2 pages)
        const oddPagesPdf = await PDFDocument.create();
        const evenPagesPdf = await PDFDocument.create();

        for (let i = 0; i < totalPages; i++) {
          if ((i + 1) % 2 === 1) {
            const [pageToCopy] = await oddPagesPdf.copyPages(examsPDF, [i]);
            oddPagesPdf.addPage(pageToCopy);
          } else {
            const [pageToCopy] = await evenPagesPdf.copyPages(examsPDF, [i]);
            evenPagesPdf.addPage(pageToCopy);
          }
        }
        ensureDirectoryExistence(destinationDir1);
        ensureDirectoryExistence(destinationDir2);

        const oddBytes = await oddPagesPdf.save();
        fs.writeFileSync(path.join(destinationDir1, "front_pages.pdf"), oddBytes);
        const evenBytes = await evenPagesPdf.save();
        fs.writeFileSync(path.join(destinationDir2, "back_pages.pdf"), evenBytes);

        fs.unlinkSync(tempFilePath); // Clean up the temporary file

        res.json({ message: "Exam uploaded and split successfully." });
      } else {
        return res.status(400).send("Invalid exam type or number of questions.");
      }
    } catch (error) {
      console.error("Error processing PDF file:", error);
      res.status(500).send("Error processing PDF file");
    }
  });
});

router.post("/fetchChangelog", checkJwt, checkPermissions(["read:grades"]), getGradeChangeLog);

router.post("/getResults", checkJwt, checkPermissions(["read:grades"]), async function (req, res) {
  const singlePage = req.body.singlePage;
  const inputDirPath = path.join(__dirname, "../../omr/inputs");
  const outputDirPath = path.join(__dirname, "../../omr/outputs");
  if (singlePage) {
    const results = []; // Array to hold all rows of data
    console.log("singlePage");
    fs.createReadStream(path.join(outputDirPath, "Results/Results.csv"))
      .pipe(csv())
      .on("data", (data) => results.push(data)) // Push each row of data into the results array
      .on("end", () => {
        // Once file reading is done, send the entire results array as a response
        res.json({ csv_file: results });

        // Delete all files in the input and output directories
        resetOMR();
      })

      .on("error", (error) => {
        // Handle any errors during file reading
        console.error("Error reading CSV file:", error);
        res.status(500).send("Error reading CSV file");
      });
  } else {
    const resultsPage1 = [];
    const resultsPage2 = [];

    // Read page_1/Results/Results.csv
    fs.createReadStream(path.join(outputDirPath, "page_1/Results/Results.csv"))
      .pipe(csv())
      .on("data", (data) => resultsPage1.push(data))
      .on("end", () => {
        // Read page_2/Results/Results.csv
        fs.createReadStream(path.join(outputDirPath, "page_2/Results/Results.csv"))
          .pipe(csv())
          .on("data", (data) => resultsPage2.push(data))
          .on("end", () => {
            // Combine results from both pages
            const combinedResults = [{ ...resultsPage1[0], ...resultsPage2[0] }];
            // Send the combined results as a response
            res.json({ csv_file: combinedResults });

            // Delete all files in the input and output directories
            resetOMR();
          })
          .on("error", (error) => {
            console.error("Error reading CSV file from page 2:", error);
            res.status(500).send("Error reading CSV file from page 2");
          });
      })
      .on("error", (error) => {
        console.error("Error reading CSV file from page 1:", error);
        res.status(500).send("Error reading CSV file from page 1");
      });
  }
});

// Save student exams to the backend
router.post("/saveStudentExams", checkJwt, checkPermissions(["upload:file"]), async function (req, res) {
  // we will be saving whatever is in the omr outputs folder
  // we just need to figure out where to save which page
  // recall: a student has their front page and back page in different folders
  // front page in /outputs/page_1 and back page in /outputs/page_2
  // data is an array of objects
  // Object: {Score, StudentID, StudentName, back_page, front_page}
  // dest: /code/upload/Students/exam_id_${exam_id}/student_id_${student_id}
  // We will be copying both front & back page to this folder
  // path for front page: /code/omr/outputs/page_1/CheckedOMRs/colored/${front_page}
  // path for back page: /code/omr/outputs/page_2/CheckedOMRs/colored/${back_page}

  const exam_id = req.body.exam_id;
  const studentData = req.body.data;
  try {
    for (const student of studentData) {
      const student_id = student.StudentID;

      const destFilePath = path.join(__dirname, `../../uploads/Students/exam_id_${exam_id}/student_id_${student_id}`);

      const front_page_path = path.join(__dirname, `../../omr/outputs/page_1/CheckedOMRs/colored/${student.front_page}`);
      console.log("front_page_path", front_page_path);
      const original_front_page_path = path.join(__dirname, `../../omr/inputs/page_1/${student.front_page}`);
      console.log("original front page path", original_front_page_path);
      const back_page_path = path.join(__dirname, `../../omr/outputs/page_2/CheckedOMRs/colored/${student.back_page}`);
      console.log("back_page_path", back_page_path);
      const original_back_page_path = path.join(__dirname, `../../omr/inputs/page_2/${student.back_page}`);
      console.log("original back page path", original_back_page_path);

      const front_page_dest = path.join(destFilePath, "front_page.png");
      console.log("front_page_dest", front_page_dest);
      const original_front_page_dest = path.join(destFilePath, "original_front_page.png");
      console.log("original_front_page_dest", original_front_page_dest);
      const back_page_dest = path.join(destFilePath, "back_page.png");
      console.log("back_page_dest", back_page_dest);
      const original_back_page_dest = path.join(destFilePath, "original_back_page.png");
      console.log("original_back_page_dest", original_back_page_dest);

      ensureDirectoryExistence(destFilePath);

      console.log("ensured directory exists");

      try {
        fs.copyFileSync(front_page_path, front_page_dest);
        console.log("First page copied successfully");
        fs.copyFileSync(back_page_path, back_page_dest);
        console.log("Second page copied successfully");
        fs.copyFileSync(original_front_page_path, original_front_page_dest);
        console.log("Original First page copied successfully");
        fs.copyFileSync(original_back_page_path, original_back_page_dest);
        console.log("Original Second page copied successfully");
      } catch (error) {
        console.log("Error copying files:", error);
      }
    }
    res.send({ message: "Student exam saved successfully" });
  } catch (error) {
    console.error("Error saving student exam:", error);
    res.status(500).send("Error saving student exam");
  }
});

// Save the exam key uploaded by the user
router.post("/saveExamKey/:examType", checkJwt, checkPermissions(["upload:file"]), async function (req, res) {
  combinedUpload(req, res, async function (err) {
    if (err) {
      return res.status(500).send("Error uploading file.");
    }

    console.log("Request Body:", req.body);  // This should now contain the form fields
    console.log("Uploaded File:", req.files); // This should show the uploaded file

    const examType = req.params.examType;
    const numQuestions = parseInt(req.body.numQuestions, 10); // Ensure numQuestions is a number
    console.log("Exam Type:", examType);

    try {
      if (examType === "100mcq" || (examType === "custom" && numQuestions <= 100)) {
        // Handle 100mcq or custom templates with 100 or fewer questions (1 page)
        const destinationDir = "/code/omr/inputs";
        
        ensureDirectoryExistence(destinationDir);

        // Directly save the uploaded file to the destination directory
        const fileBuffer = req.files.examKey[0].buffer; // Use the buffer from the uploaded file
        const filePath = path.join(destinationDir, req.files.examKey[0].originalname);

        fs.writeFileSync(filePath, fileBuffer);

        console.log(`File uploaded to ${filePath}`);
        return res.json({ message: "File uploaded successfully" });

      } else if (examType === "200mcq" || (examType === "custom" && numQuestions > 100)) {
        // Handle 200mcq or custom templates with more than 100 questions (2 pages)
        const existingPdfBytes = req.files.examKey[0].buffer; // Use the buffer directly
        const destinationDir1 = "/code/omr/inputs/page_1";
        const destinationDir2 = "/code/omr/inputs/page_2";

        ensureDirectoryExistence(destinationDir1);
        ensureDirectoryExistence(destinationDir2);

        try {
          const keyPDF = await PDFDocument.load(existingPdfBytes);

          const key_page_1 = await PDFDocument.create();
          const key_page_2 = await PDFDocument.create();

          const [page1] = await key_page_1.copyPages(keyPDF, [0]);
          const [page2] = await key_page_2.copyPages(keyPDF, [1]);

          key_page_1.addPage(page1);
          key_page_2.addPage(page2);
          const key_page_1_Bytes = await key_page_1.save();
          fs.writeFileSync(path.join(destinationDir1, "page_1.pdf"), key_page_1_Bytes);
          const key_page_2_Bytes = await key_page_2.save();
          fs.writeFileSync(path.join(destinationDir2, "page_2.pdf"), key_page_2_Bytes);

          return res.json({ message: "200mcq or custom key uploaded and split successfully" });
        } catch (error) {
          console.error("Error processing PDF file:", error);
          return res.status(500).send("Error processing PDF file");
        }
      } else {
        return res.status(400).send("Invalid exam type or number of questions.");
      }
    } catch (error) {
      console.error("Error in saveExamKey:", error);
      return res.status(500).send("Internal server error.");
    }
  });
});



// Copy the template JSON file to the shared volume
router.post("/copyTemplate", checkJwt, checkPermissions(["upload:file"]), async function (req, res) {
  console.log("copyTemplate");
  const { examType, keyOrExam, numQuestions, examTitle, classID, courseId } = req.body;

  const filePath_1 = "/code/omr/inputs/page_1";
  const filePath_2 = "/code/omr/inputs/page_2";
  const singlePageDir = "/code/omr/inputs";

  try {
    let templatePath_1, templatePath_2;

    if (examType === "100mcq" && keyOrExam === "key") {
      templatePath_2 = path.join(__dirname, "../assets/templates/100mcq_page_2.json");
      ensureDirectoryExistence(filePath_2);
      fs.copyFileSync(templatePath_2, path.join(filePath_2, "template.json"));
      console.log("Template.json copied successfully for 100mcq key");
      return res.json({ message: "File copied successfully" });
    }

    if (examType === "200mcq" || (examType === "custom" && numQuestions > 100)) {
      if (examType === "custom") {
        templatePath_1 = path.join(__dirname, `../assets/custom/${courseId}_${examTitle}_${classID}/custom_page_1.json`);
        templatePath_2 = path.join(__dirname, `../assets/custom/${courseId}_${examTitle}_${classID}/custom_page_2.json`);
      } else {
        templatePath_1 = path.join(__dirname, `../assets/templates/${examType}_page_1.json`);
        templatePath_2 = path.join(__dirname, `../assets/templates/${examType}_page_2.json`);
      }

      ensureDirectoryExistence(filePath_1);
      ensureDirectoryExistence(filePath_2);

      fs.copyFileSync(templatePath_1, path.join(filePath_1, "template.json"));
      console.log("First template.json copied successfully");
      fs.copyFileSync(templatePath_2, path.join(filePath_2, "template.json"));
      console.log("Second template.json copied successfully");

      return res.json({ message: "Files copied successfully" });
    }

    if (examType === "custom" && numQuestions <= 100) {
      templatePath_1 = path.join(__dirname, `../assets/custom/${courseId}_${examTitle}_${classID}/custom_page_1.json`);
      ensureDirectoryExistence(singlePageDir);
      fs.copyFileSync(templatePath_1, path.join(singlePageDir, "template.json"));
      console.log("Custom template.json for page 1 copied successfully");
      return res.json({ message: "File copied successfully" });
    }

    if (examType === "100mcq" && keyOrExam === "exam") {
      templatePath_1 = path.join(__dirname, `../assets/templates/100mcq_page_1.json`);
      templatePath_2 = path.join(__dirname, `../assets/templates/100mcq_page_2.json`);

      ensureDirectoryExistence(filePath_1);
      ensureDirectoryExistence(filePath_2);

      fs.copyFileSync(templatePath_1, path.join(filePath_1, "template.json"));
      console.log("First template.json copied successfully for 100mcq exam");
      fs.copyFileSync(templatePath_2, path.join(filePath_2, "template.json"));
      console.log("Second template.json copied successfully for 100mcq exam");

      return res.json({ message: "Files copied successfully" });
    }

    return res.status(400).json({ error: "Invalid request parameters." });
  } catch (error) {
    console.error("Error copying template.json:", error);
    return res.status(500).json({ error: "Error copying template.json" });
  }
});


// Generate the evaluation JSON for an exam
router.post("/GenerateEvaluation", checkJwt, checkPermissions(["create:evaluation"]), async function (req, res) {
  const { examType, exam_id, numQuestions } = req.body;

  if (!exam_id) {
    return res.status(400).json({ error: "Missing exam_id" });
  }

  try {
    const answerKey = await getAnswerKeyForExam(exam_id);
    const customMarkingSchemes = await getCustomMarkingSchemes(exam_id);

    const markingSchemes = {
      DEFAULT: {
        correct: "1",
        incorrect: "0",
        unmarked: "0",
      },
    };

    for (const [sectionName, scheme] of Object.entries(customMarkingSchemes)) {
      markingSchemes[sectionName] = {
        questions: scheme.questions,
        marking: scheme.marking,
      };
    }

    if (examType === "200mcq" || (examType === "custom" && numQuestions > 100)) {
      const firstHalfQuestions = answerKey.slice(0, 100);
      const secondHalfQuestions = answerKey.slice(100);

      const evaluationJsonPage1 = createEvaluationJson(firstHalfQuestions, markingSchemes, 1);
      const evaluationJsonPage2 = createEvaluationJson(secondHalfQuestions, markingSchemes, 101);

      ensureDirectoryExistence("/code/omr/inputs/page_1");
      ensureDirectoryExistence("/code/omr/inputs/page_2");

      fs.writeFileSync("/code/omr/inputs/page_1/evaluation.json", JSON.stringify(evaluationJsonPage1, null, 2));
      fs.writeFileSync("/code/omr/inputs/page_2/evaluation.json", JSON.stringify(evaluationJsonPage2, null, 2));

      return res.json({ message: "evaluation.json files created successfully for 200mcq or custom with more than 100 questions" });
    } else if (examType === "100mcq") {
      const evaluationJson = createEvaluationJson(answerKey, markingSchemes, 1);

      ensureDirectoryExistence("/code/omr/inputs/page_2");
      fs.writeFileSync("/code/omr/inputs/page_2/evaluation.json", JSON.stringify(evaluationJson, null, 2));

      return res.json({ message: "evaluation.json created successfully for 100mcq o" });
    } 
    else if (examType === "custom" && numQuestions <= 100) {
      const evaluationJson = createEvaluationJson(answerKey, markingSchemes, 1);

      ensureDirectoryExistence("/code/omr/inputs/");
      fs.writeFileSync("/code/omr/inputs/evaluation.json", JSON.stringify(evaluationJson, null, 2));

      return res.json({ message: "evaluation.json created successfully for custom with 100 or fewer questions" });
    } else {
      return res.status(400).json({ error: "Invalid exam type." });
    }
  } catch (error) {
    console.error("Error in /GenerateEvaluation:", error);
    return res.status(500).json({ error: "Error generating evaluation file" });
  }
});


function createEvaluationJson(questions, markingSchemes, questionStartIndex) {
  return {
    source_type: "custom",
    options: {
      questions_in_order: Array.from({ length: questions.length }, (_, i) => `q${i + questionStartIndex}`),
      answers_in_order: questions,
    },
    outputs_configuration: {
      should_explain_scoring: true,
      draw_score: {
        enabled: true,
        position: [600, 1100],
        size: 1.5,
      },
      draw_answers_summary: {
        enabled: true,
        position: [300, 1200],
        size: 1.0,
      },
      draw_question_verdicts: {
        enabled: true,
        verdict_colors: {
          correct: "#00ff00",
          neutral: "#ff0000",
          incorrect: "#ff0000",
        },
        verdict_symbol_colors: {
          positive: "#000000",
          neutral: "#000000",
          negative: "#000000",
        },
        draw_answer_groups: {
          enabled: true,
        },
      },
      draw_detected_bubble_texts: {
        enabled: false,
      },
    },
    marking_schemes: markingSchemes,
  };
}

// Call the OMR processing service
router.post("/callOMR", checkJwt, checkPermissions(["upload:file"]), async function (req, res) {
  console.log("callOMR");
  try {
    const response = await fetch("http://flaskomr:5000/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("OMR Response: ", response);
    res.send(JSON.stringify("OMR called successfully in /callOMR"));
  } catch (error) {
    console.error("Error calling OMR: ", error);
  }
});

// Route to fetch the first PNG image in the folder
router.post("/fetchImage", checkJwt, checkPermissions(["read:image"]), async function (req, res) {
  const imagesFolderPath = path.join(__dirname, req.body.file_name);
  console.log(imagesFolderPath);
  console.log(req.body.file_name);
  try {
    // imagesFolderPath = path.resolve(__dirname, `../../uploads/Students/exam_id_5/student_id_1/${filename}`);
    res.sendFile(imagesFolderPath);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).send("Error fetching image");
  }
});

router.get("/getScoreByExamId/:exam_id", checkJwt, checkPermissions(["read:grades"]), async (req, res) => {
  try {
    const exam_id = parseInt(req.params.exam_id, 10);
    if (isNaN(exam_id)) {
      return res.status(400).send("Invalid exam_id");
    }
    const scores = await getScoreByExamId(exam_id);
    if (scores.length === 0) {
      return res.status(404).send("No scores found for this exam");
    }
    res.json({ scores });
  } catch (error) {
    console.error("Error in /getScoreByExamId:", error);
    res.status(500).send("Error retrieving scores");
  }
});

router.get("/getExamQuestionDetails/:exam_id", checkJwt, checkPermissions(["read:exam"]), async (req, res) => {
  try {
    const exam_id = parseInt(req.params.exam_id, 10);
    if (isNaN(exam_id)) {
      return res.status(400).send("Invalid exam_id");
    }

    const examDetails = await getExamQuestionDetails(exam_id);
    if (!examDetails || !examDetails.totalQuestions || !examDetails.examType) {
      return res.status(404).send("No exam details found for this exam");
    }

    res.json({ examDetails });
  } catch (error) {
    console.error("Error in /getExamQuestionDetails:", error);
    res.status(500).send("Error retrieving exam details");
  }
});


router.post("/saveResults", saveResults);

// router.get("/searchExam/:student_id", checkJwt, checkPermissions(["read:students"]), async (req, res) => {
//   const studentId = req.params.student_id;
//   const filePath = path.join(__dirname, "../../omr/outputs/Results/Results.csv");
//   let found = false; // Flag to check if student is found

//   fs.createReadStream(filePath)
//     .pipe(csv())
//     .on("data", (data) => {
//       if (data.StudentID === studentId) {
//         found = true;
//         res.json({ file_id: data.file_id });
//       }
//     })
//     .on("end", () => {
//       if (!found) {
//         res.status(404).send("Student ID not found");
//       }
//     })
//     .on("error", (error) => {
//       console.error("Error reading CSV file:", error);
//       res.status(500).send("Error reading CSV file");
//     });
// });

// There are 2 folders in outputs: page_1 and page_2
// The first folder contains the ID page and the second folder contains the question page
// Each ID page has a matching question page
// e.g front_pages_page_1.png = back_pages_page_1.png
// We extract the ID from front_pages_page_1.png and the answers from back_pages_page_1.png
// Create a CSV file with the following fields:
// "front_page_id", "back_page_id", "score", "student_id", "question_1", "question_2", ..., "question_100"
router.get("/preprocessingCSV", checkJwt, checkPermissions(["upload:file"]), async (req, res) => {
  console.log("Hello from preprocessingCSV");
  const frontPagePath = path.join(__dirname, "../../omr/outputs/page_1/Results/Results.csv");
  const backPagePath = path.join(__dirname, "../../omr/outputs/page_2/Results/Results.csv");
  const outputPath = path.join(__dirname, "../../omr/outputs/combined.csv");

  // ensureDirectoryExistence(path.join(__dirname, "../../omr/outputs"));

  const frontPageData = [];
  const backPageData = [];

  // Read front_page.csv
  fs.createReadStream(frontPagePath)
    .pipe(csv())
    .on("data", (data) => {
      frontPageData.push({
        front_page_file_id: data.file_id,
        FirstName: data.FirstName,
        LastName: data.LastName,
        StudentID: data.StudentID,
        score: data.score,
      });
    })
    .on("end", () => {
      // Read back_page.csv
      fs.createReadStream(backPagePath)
        .pipe(csv())
        .on("data", (data) => {
          backPageData.push({
            back_page_file_id: data.file_id,
            score: data.score,
          });
        })
        .on("end", () => {
          // Combine data from both CSV files
          const combinedData = frontPageData.map((frontData) => {
            const backData = backPageData.find((back) => back.back_page_file_id.slice(-6) === frontData.front_page_file_id.slice(-6));
            return {
              ...frontData,
              back_page_file_id: backData ? backData.back_page_file_id : null,
              score: backData && frontData ? parseInt(backData.score, 10) + parseInt(frontData.score, 10) : null,
            };
          });

          // Convert combined data to CSV format
          const json2csvParser = new Parser();
          const csvData = json2csvParser.parse(combinedData);

          // Save the combined CSV data to a file
          fs.writeFile(outputPath, csvData, (err) => {
            if (err) {
              console.log("Error writing combined.csv:", err);
              res.status(500).json("Error writing combined.csv");
            } else {
              console.log("Combined CSV file saved successfully.");
              res.status(200).json("Combined CSV file saved successfully.");
            }
          });
        })
        .on("error", (error) => {
          console.error("Error reading back_page.csv:", error);
          res.status(500).json("Error reading back_page.csv");
        });
    })
    .on("error", (error) => {
      console.error("Error reading front_page.csv:", error);
      res.status(500).json("Error reading front_page.csv");
    });
});

router.post("/fetchStudentExam/:exam_id", checkJwt, checkPermissions(["read:exam_student"]), fetchStudentExam);

router.post("/fetchSolution/:exam_id", checkJwt, checkPermissions(["read:exam_student"]), fetchSolution);

router.post("/changeGrade", checkJwt, checkPermissions(["read:exam_student"]), changeGrade);

//test routes
router.post("/test", checkJwt, checkPermissions(["upload:file"]), async function (req, res) {
  console.log("test called");
  res.send(JSON.stringify("Test route called successfully"));
});

module.exports = router;
