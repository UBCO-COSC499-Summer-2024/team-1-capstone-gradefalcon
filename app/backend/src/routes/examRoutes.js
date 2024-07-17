const express = require("express");
const {
  saveQuestions,
  newExam,
  examBoard,
  getAverageperExam,
  getAverageperCourse,
  getStudentGrades
} = require("../controllers/examController");
const { upload } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/saveQuestions", saveQuestions);
router.post("/NewExam/:class_id", newExam);
router.post("/ExamBoard", examBoard);
router.get("/average-per-exam", getAverageperExam);
router.get("/average-per-course", getAverageperCourse); // Updated route
router.get('/grades/:studentId', getStudentGrades);

router.post("/saveExamKey", upload.single("examKey"), async function (req, res) {
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
