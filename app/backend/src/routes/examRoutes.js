const express = require("express");
const {
  saveQuestions,
  newExam,
  examBoard,
  getStandardAverageData,
  getPerformanceData,
  getAnswerKeyForExam
} = require("../controllers/examController");
const { upload } = require("../middleware/uploadMiddleware");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const router = express.Router();

router.post("/saveQuestions", saveQuestions);
router.post("/NewExam/:class_id", newExam);
router.post("/ExamBoard", examBoard);
router.get("/standard-average-data", getStandardAverageData);
router.get("/performance-data", getPerformanceData);
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

router.post( "/saveExamKey",upload.single("examKey"), async function (req, res) {
    console.log(req.file);
    res.send(JSON.stringify("File uploaded successfully"));
  }
);

router.post("/copyTemplate", async function (req, res) {
  console.log("copyTemplate");
  const filePath = `/code/omr/inputs`;
  const templatePath = path.join(__dirname, "../assets/template.json"); // Adjust the path as necessary
  const destinationTemplatePath = path.join(filePath, "template.json");

  try {
    // Copy template.json to the shared volume
    fs.copyFileSync(templatePath, destinationTemplatePath);
    console.log("Template.json copied successfully");
  } catch (error) {}

  res.send(JSON.stringify("File copied successfully"));
});

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

router.post("/GenerateEvaluation", async function (req, res) {
  const { exam_id } = req.body;

  try {
    // Validate exam_id
    if (!exam_id) {
      return res.status(400).send("Missing exam_id");
    }

    // Get answer key from the database
    const answerKey = await getAnswerKeyForExam(exam_id);

    // Create evaluation.json
    const evaluationJson = {
      source_type: "custom",
      options: {
        questions_in_order: Array.from({ length: 6 }, (_, i) => `q${i + 1}`),
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
      marking_schemes: {
        DEFAULT: {
          correct: "1",
          incorrect: "0",
          unmarked: "0",
        },
      },
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

router.get('/fetchImage', async function (req, res) {
  const imagePath = path.join(__dirname, '../../omr/outputs/CheckedOMRs/colored/StudentAnswers_page_1.png');
  
  // Send the image file
  res.sendFile(imagePath);
});
router.post("/test", async function (req, res) {
  console.log("test called");
  res.send(JSON.stringify("Test route called successfully"));
});

module.exports = router;
