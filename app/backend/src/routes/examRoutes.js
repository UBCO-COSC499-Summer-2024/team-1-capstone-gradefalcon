const express = require("express");
const {
  saveQuestions,
  newExam,
  examBoard,
  getAnswerKeyForExam,
  getAveragePerExam,
  getAveragePerCourse,
  getStudentGrades,

} = require("../controllers/examController");
const { upload } = require("../middleware/uploadMiddleware");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const router = express.Router();

router.post("/saveQuestions", saveQuestions);
router.post("/NewExam/:class_id", newExam);
router.post("/ExamBoard", examBoard);
router.get("/average-per-exam", getAveragePerExam);
router.get("/average-per-course", getAveragePerCourse); // Updated route
router.get("/grades/:studentId", getStudentGrades);


// Function to get the answer key for a specific exam

router.get('/getAnswerKey/:exam_id', async (req, res, next) => {
  try {
    const exam_id = parseInt(req.params.exam_id, 10);
    if (isNaN(exam_id)) {
      throw new Error("Invalid exam_id");
    }
    const answerKey = await getAnswerKeyForExam(exam_id);
    res.json({ answerKey });
  } catch (error) {
    console.error('Error in /getAnswerKey:', error);
    res.status(500).send('Error getting answer key');
  }
});


// Get results from CSV file
router.get("/getResults", async function (req, res) {
  const filePath = path.join(
    __dirname,
    "../../omr/outputs/Results/Results.csv"
  );
  const results = []; // Array to hold all rows of data

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => results.push(data)) // Push each row of data into the results array
    .on("end", () => {
      // Once file reading is done, send the entire results array as a response
      res.json({ csv_file: results });
    })

    .on("error", (error) => {
      // Handle any errors during file reading
      console.error("Error reading CSV file:", error);
      res.status(500).send("Error reading CSV file");
    });
});



// Save the exam key uploaded by the user
router.post( "/saveExamKey",upload.single("examKey"), async function (req, res) {
    console.log(req.file);
    res.send(JSON.stringify("File uploaded successfully"));
  }
);


// Copy the template JSON file to the shared volume
router.post("/copyTemplate", async function (req, res) {
  console.log("copyTemplate");
  const filePath = `/code/omr/inputs`;
  const templatePath = path.join(__dirname, "../assets/template.json"); // Adjust the path as necessary
  const destinationTemplatePath = path.join(filePath, "template.json");

  try {
    fs.copyFileSync(templatePath, destinationTemplatePath);
    console.log("Template.json copied successfully");
  } catch (error) {}

  res.send(JSON.stringify("File copied successfully"));
});

const getCustomMarkingSchemes = async (examId) => {
  const res = await pool.query(
    "SELECT section_name, questions, correct, incorrect, unmarked FROM marking_schemes WHERE exam_id = $1",
    [examId]
  );
  return res.rows.reduce((acc, row) => {
    acc[row.section_name] = {
      questions: row.questions.split(",").map((q) => q.trim()),
      marking: {
        correct: row.correct,
        incorrect: row.incorrect,
        unmarked: row.unmarked,
      },
    };
    return acc;
  }, {});
};


router.post("/GenerateEvaluation", async function (req, res) {
  const { exam_id } = req.body;

  try {
    if (!exam_id) {
      return res.status(400).send("Missing exam_id");
    }

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

    const evaluationJson = {
      source_type: "custom",
      options: {
        questions_in_order: Array.from({ length: answerKey.length }, (_, i) => `q${i + 1}`),
        answers_in_order: answerKey,
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

    const destinationDir = `/code/omr/inputs`;
    const evaluationFilePath = path.join(destinationDir, "evaluation.json");
    fs.writeFileSync(evaluationFilePath, JSON.stringify(evaluationJson, null, 2));

    res.json({ message: "evaluation.json created successfully" });
  } catch (error) {
    console.error("Error in /GenerateEvaluation:", error);
    res.status(500).send("Error generating evaluation file");
  }
});

// Upload exam pages
router.post("/UploadExam", upload.single("examPages"), async function (req, res) {
  const { exam_id } = req.body;

  try {
    // Here, we only handle the file upload
    res.json({ message: "File uploaded successfully", exam_id });
  } catch (error) {
    console.error("Error in /UploadExam:", error);
    res.status(500).send("Error uploading exam pages");
  }
});


// Call the OMR processing service
router.post("/callOMR", async function (req, res) {
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
router.get('/fetchImage', async function (req, res) {
  const imagesFolderPath = path.join(__dirname, '../../omr/outputs/CheckedOMRs/colored');

  try {
    // Read all files in the directory
    const files = await fs.promises.readdir(imagesFolderPath);

    // Filter out the PNG files
    const pngFiles = files.filter(file => path.extname(file).toLowerCase() === '.png');

    if (pngFiles.length === 0) {
      return res.status(404).send('No PNG images found in the folder');
    }

    // Get the first PNG file
    const firstPngFile = pngFiles[0];
    const imagePath = path.join(imagesFolderPath, firstPngFile);

    // Send the image file
    res.sendFile(imagePath);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Error fetching image');
  }
});

//test routes
router.post("/test", async function (req, res) {
  console.log("test called");
  res.send(JSON.stringify("Test route called successfully"));
});

module.exports = router;
