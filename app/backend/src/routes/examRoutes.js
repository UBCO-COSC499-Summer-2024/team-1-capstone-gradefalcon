const express = require("express");
const {
  saveQuestions,
  newExam,
  examBoard,
} = require("../controllers/examController");
const { upload } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/saveQuestions", saveQuestions);
router.post("/NewExam/:class_id", newExam);
router.post("/ExamBoard", examBoard);

router.post(
  "/saveExamKey",
  upload.single("examKey"),
  async function (req, res) {
    console.log(req.file);
    console.log(req.body.examTitle);
    console.log(req.body.classID);
    try {
      const response = await fetch("http://flaskomr:5000/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filePath: `/code/omr/inputs/${req.file.originalname}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error processing OMR: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(result);
      res.send("File uploaded and OMR processing completed successfully");
    } catch (error) {
      console.error("Error processing OMR:", error);
      res.status(500).send("File uploaded but OMR processing failed");
    }
  }
);

module.exports = router;
