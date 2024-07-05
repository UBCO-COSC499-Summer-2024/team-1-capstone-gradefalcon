const express = require("express");
const {
  saveQuestions,
  newExam,
  examBoard,
} = require("../controllers/examController");
const { upload } = require("../middleware/uploadMiddleware");
const { sendToQueue } = require("../controllers/examController");

const router = express.Router();

router.post("/saveQuestions", saveQuestions);
router.post("/NewExam/:class_id", newExam);
router.post("/ExamBoard", examBoard);

router.post("/saveExamKey", upload.single("examKey"), function (req, res) {
  console.log(req.file);
  res.send("File uploaded successfully");
  const filePath = `/app/omr/${req.file.originalname}`;
  sendToQueue(filePath);
  console.log("File path sent to queue");
});

module.exports = router;
