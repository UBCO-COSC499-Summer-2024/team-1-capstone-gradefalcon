const express = require("express");
const {
  saveQuestions,
  newExam,
  examBoard,
  getStandardAverageData,
  getPerformanceData,
} = require("../controllers/examController");
const { upload } = require("../middleware/uploadMiddleware");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.post("/saveQuestions", saveQuestions);
router.post("/NewExam/:class_id", newExam);
router.post("/ExamBoard", examBoard);
router.get("/standard-average-data", getStandardAverageData);
router.get("/performance-data", getPerformanceData);

//copy Json
const copyTemplateJson = async () => {
  const templatePath = path.join(__dirname, "../assets/template.json");
  const destinationPath = path.join("/code/omr/inputs/template.json");

  try {
    await fs.promises.copyFile(templatePath, destinationPath);
    console.log("Template.json copied successfully");
  } catch (error) {
    console.error("Error copying template.json: ", error);
    throw new Error(`Error copying template.json: ${error.message}`);
  }
};

  
router.post("/saveExamKey", upload.single("examKey"), async function (req, res) {
  try {
    await copyTemplateJson();
    res.status(200).send("JSON template copied successfully");
  } catch (error) {
    res.status(500).send(`Error copying JSON template: ${error.message}`);
  }

    try {

      const response = await fetch("http://flaskomr:5000/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error processing OMR: ${response.statusText} - ${errorText}`
        );
      }

      const data = await response.json();
      console.log("OMR Processed: ", data);
      res.send("File uploaded and processed successfully");
    } catch (error) {
      console.error("Error processing OMR: ", error);
      res.status(500).send(`Error processing OMR: ${error.message}`);
    }
  }
);

module.exports = router;
