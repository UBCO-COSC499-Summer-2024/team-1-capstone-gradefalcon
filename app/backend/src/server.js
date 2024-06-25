const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const bodyParser = require('body-parser');
const pool = require('./utils/db');

const authRoutes = require('./routes/authRoutes');
const classRoutes = require('./routes/classRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

// Set up session middleware
app.use(
  session({
    store: new PgSession({
      pool: pool, // Connection pool
      tableName: "session", // Use another table-name if you want to override default
    }),
    secret: "secret", // Change this to a secure secret key
    resave: false, // This is true by default. It is recommended to set it to false
    saveUninitialized: false, // This is true by default. It is recommended to set it to false
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true, // Ensures the cookie is sent only over HTTP(S), not accessible to client JavaScript
      secure: false, // Set to true if using https
    },
  })
);

app.use('/auth', authRoutes);
app.use('/class', classRoutes);
app.use('/users', userRoutes);

app.get('/healthz', (req, res) => {
  res.send('I am happy and healthy\n');
});

app.param("class_id", function (req, res, next, class_id) {
  req.session.class_id = class_id;
  req.session.save();
  next();
});

// Save solution questions and answers*
app.post("/saveQuestions", async (req, res, next) => {
  const questions = req.body.questions; // Assuming questions is an array of question objects
  const classID = req.body.classID;
  const examTitle = req.body.examTitle;
  const numQuestions = req.body.numQuestions;

  // Convert the questions dictionary into an array of strings*
  const questionsArray = Object.entries(questions).map(
    ([key, value]) => `${value.question}:${value.option}`
  );

  try {
    const writeToExam = await pool.query(
      "INSERT INTO exam (class_id, exam_title, total_questions, total_marks) VALUES ($1, $2, $3, 10) RETURNING exam_id",
      [classID, examTitle, numQuestions]
    );
    const insertedRowId = writeToExam.rows[0].exam_id;
    const writeToSolution = await pool.query(
      "INSERT INTO solution (exam_id, answers) VALUES ($1, $2)",
      [insertedRowId, questionsArray]
    );
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

// Exam route*
app.post("/NewExam/:class_id", async (req, res, next) => {
  const { exam_id, student_id, grade } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO studentResults (exam_id, student_id, grade) VALUES ($1, $2, $3) RETURNING *",
      [exam_id, student_id, grade]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Display classes and their exams route*
app.post("/ExamBoard", async (req, res, next) => {
  const instructorId = req.session.userId;
  try {
    const classes = await pool.query(
      "SELECT exam_id, classes.class_id, exam_title, course_id, course_name FROM exam RIGHT JOIN classes ON (exam.class_id = classes.class_id) WHERE instructor_id = $1 ",
      [instructorId]
    );

    res.json({ classes: classes.rows });
  } catch (err) {
    next(err);
  }
});

// Session info route
app.get("/session-info", (req, res) => {
  res.json({
    userId: req.session.userId,
    userName: req.session.userName,
  });
});


const PORT = process.env.PORT || 80;
console.log(`Starting server on port ${PORT}`);

module.exports = app;
