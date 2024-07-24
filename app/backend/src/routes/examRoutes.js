const express = require("express");
const {
  saveQuestions,
  newExam,
  examBoard,
  getStandardAverageData,
  getPerformanceData,
  getStudentGrades
} = require("../controllers/examController");
const { upload } = require("../middleware/uploadMiddleware");
const { checkJwt, checkPermissions, checkRole } = require('../auth0'); // Importing from auth.js
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const router = express.Router();

router.post("/saveQuestions", checkJwt, checkRole('instructor'), checkPermissions(['create:exam']), saveQuestions);
router.post("/NewExam/:class_id", checkJwt, checkRole('instructor'), checkPermissions(['create:exam']), newExam);
router.post("/ExamBoard", checkJwt, checkRole('instructor'), checkPermissions(['read:exams']), examBoard);
router.get("/standard-average-data", checkJwt, checkRole('instructor'), checkPermissions(['read:standardAverageData']), getStandardAverageData);
router.get("/performance-data", checkJwt, checkRole('instructor'), checkPermissions(['read:performanceData']), getPerformanceData);
router.get('/grades/:studentId', checkJwt, checkRole('instructor'), checkPermissions(['read:grades']), getStudentGrades);

router.get("/getResults", checkJwt, checkRole('instructor'), checkPermissions(['read:grades']), async function (req, res) {
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
  checkJwt, checkRole('instructor'), checkPermissions(['upload:file']), upload.single("examKey"),
  async function (req, res) {
    console.log(req.file);
    res.send(JSON.stringify("File uploaded successfully"));
  }
);

router.post("/copyTemplate", checkJwt, checkRole('instructor'), checkPermissions(['upload:file']), async function (req, res) {
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

router.post("/callOMR", checkJwt, checkRole('instructor'), checkPermissions(['upload:file']), async function (req, res) {
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

router.post("/test", checkJwt, checkRole('instructor'), checkPermissions(['upload:file']), async function (req, res) {
  console.log("test called");
  res.send(JSON.stringify("Test route called successfully"));
});

module.exports = router;
