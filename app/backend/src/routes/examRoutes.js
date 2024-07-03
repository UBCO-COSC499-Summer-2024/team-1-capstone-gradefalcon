const express = require("express");
const {
  saveQuestions,
  newExam,
  examBoard,
} = require("../controllers/examController");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/saveQuestions", saveQuestions);
router.post("/NewExam/:class_id", newExam);
router.post("/ExamBoard", examBoard);

router.post("/saveExamKey", upload.single("examKey"), function (req, res) {
  console.log(req.file);
  res.send("File uploaded successfully");
});

module.exports = router;
