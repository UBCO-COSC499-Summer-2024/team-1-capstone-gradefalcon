const express = require("express");
const {
  saveQuestions,
  newExam,
  examBoard,
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

router.post(
  "/saveExamKey",
  upload.single("examKey"),
  async function (req, res) {
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

router.post("/test", async function (req, res) {
  console.log("test called");
  res.send(JSON.stringify("Test route called successfully"));
});

module.exports = router;
