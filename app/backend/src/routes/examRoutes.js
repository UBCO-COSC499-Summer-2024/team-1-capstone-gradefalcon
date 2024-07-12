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
const csv = require("csv-parser");

const router = express.Router();

router.post("/saveQuestions", saveQuestions);
router.post("/NewExam/:class_id", newExam);
router.post("/ExamBoard", examBoard);
router.get("/standard-average-data", getStandardAverageData);
router.get("/performance-data", getPerformanceData);

router.get("/getResults", async function (req, res) {
  // need to modify this to make the path dynamic
  const filePath = path.join(
    __dirname,
    "../../omr/outputs/Results/Results.csv"
  );

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => {
      console.log(data);
      res.json({ csv_file: data });
    });
});

router.post(
  "/saveExamKey",
  upload.single("examKey"),
  async function (req, res) {
    console.log(req.file);
    // const filePath = `/code/omr/inputs`;
    // const templatePath = path.join(__dirname, "../assets/template.json"); // Adjust the path as necessary
    // const destinationTemplatePath = path.join(filePath, "template.json");

    // try {
    //   // Copy template.json to the shared volume
    //   fs.copyFileSync(templatePath, destinationTemplatePath);
    //   console.log("Template.json copied successfully");

    // const response = await fetch("http://flaskomr:5000/process", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ filePath }),
    // });
    // console.log("OMR Response: ", response);
    // if (!response.ok) {
    //   const errorText = await response.text();
    //   throw new Error(
    //     `Error processing OMR: ${response.statusText} - ${errorText}`
    //   );
    // }

    // const data = await response.json();
    // console.log("OMR Processed: ", data);
    // res.send("File uploaded and processed successfully");
    // } catch (error) {
    //   console.error("Error processing OMR: ", error);
    //   res.status(500).send(`Error processing OMR: ${error.message}`);
    // }
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
  } catch (error) {
    console.error("Error calling OMR: ", error);
  }
});

router.post("/test", async function (req, res) {
  console.log("test called");
  res.send(JSON.stringify("Test route called successfully"));
});

module.exports = router;
