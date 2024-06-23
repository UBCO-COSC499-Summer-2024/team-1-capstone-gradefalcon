const express = require("express");
const morgan = require("morgan");
const { Pool } = require("pg");
const session = require("express-session");
const PgSession = require("connect-pg-simple")(session);
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const config = require("./config");

const app = express();

// PostgreSQL pool setup
const pool = new Pool(config.database);

app.use(morgan("common"));
app.use(bodyParser.json());

const secretKey = process.env.JWT_SECRET || "secret"; // strong secret key store it in environment variables

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

// Display classes
app.post("/classes", async (req, res, next) => {
  try {
    const instructorId = req.session.userId; // Get the instructor ID from the session
    const result = await pool.query(
      "SELECT * FROM classes WHERE instructor_id = $1",
      [instructorId]
    );
    const classes = result.rows; // Get all rows, not just the first one
    res.json(classes); // Send the list of classes as JSON
  } catch (err) {
    next(err);
  }
});

app.param("class_id", function (req, res, next, class_id) {
  req.session.class_id = class_id;
  req.session.save();
  next();
});

app.post("/saveQuestions", async (req, res, next) => {
  const questions = req.body.questions; // Assuming questions is an array of question objects
  const classID = req.body.classID;
  const examTitle = req.body.examTitle;
  const numQuestions = req.body.numQuestions;

  // Convert the questions dictionary into an array of strings
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

// Display students enrolled, exam grades too
app.post("/classManagement/:class_id", async (req, res, next) => {
  try {
    // Get the student_id and name
    // This will always be displayed regardless of exams taken
    const class_id = req.session.class_id;
    const result = await pool.query(
      "SELECT student_id, name FROM enrollment JOIN student USING (student_id) WHERE class_id = $1",
      [class_id]
    );
    const classData = result.rows; // Get the first row only

    // Get the exam_id and grade
    // This will only be displayed if the student has taken the exam

    const examResults = classData.map((student) =>
      pool
        .query(
          "SELECT exam_id, grade FROM studentResults WHERE student_id = $1",
          [student.student_id]
        )
        .then((result) => ({
          student_id: student.student_id,
          name: student.name,
          exams: result.rows, // This will be an array of exam results
        }))
    );

    // Wait for all promises to resolve
    const combinedResults = await Promise.all(examResults);

    // Now let's get the course code and course name given class_id
    const courseQuery = await pool.query(
      "SELECT course_id, course_name FROM classes WHERE class_id = $1",
      [class_id]
    );
    const courseDetails = courseQuery.rows;

    // Combine the students info and course details
    const response = {
      studentInfo: combinedResults,
      courseDetails: courseDetails,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Exam route
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

// User registration route
app.post("/signup", async (req, res, next) => {
  const { email, password, name, role } = req.body;

  try {
    // Check if the email already exists
    let existingUser;

    existingUser = await pool.query("SELECT * FROM student WHERE email = $1", [
      email,
    ]);

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }
    let result;
    // const hashedPassword = await bcrypt.hash(password, 10);
    result = await pool.query(
      "INSERT INTO student (email, password, name) VALUES ($1, $2, $3) RETURNING student_id",
      [email, password, name]
    );

    const token = jwt.sign(
      { userId: result.rows[0].instructor_id || result.rows[0].student_id },
      secretKey,
      { expiresIn: "1h" }
    );
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
});

// User login route
app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check if the user is an instructor
    let result = await pool.query("SELECT * FROM instructor WHERE email = $1", [
      email,
    ]);
    let user = result.rows[0];
    if (user && user.password === password) {
      req.session.userId = user.instructor_id;
      req.session.userName = user.name;
      req.session.role = "instructor";
      req.session.save((err) => {
        if (err) {
          return next(err);
        }
        return res.json({ message: "Login successful", role: "instructor" });
      });
      return;
    }

    // Check if the user is a student
    result = await pool.query("SELECT * FROM student WHERE email = $1", [
      email,
    ]);
    user = result.rows[0];
    if (user && user.password === password) {
      req.session.userId = user.student_id;
      req.session.userName = user.name;
      req.session.role = "student";
      req.session.save((err) => {
        if (err) {
          return next(err);
        }
        return res.json({ message: "Login successful", role: "student" });
      });
      return;
    }

    // Check if the user is an admin
    result = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);
    user = result.rows[0];
    if (user && user.password === password) {
      req.session.userId = user.admin_id;
      req.session.userName = user.name;
      req.session.role = "admin";
      req.session.save((err) => {
        if (err) {
          return next(err);
        }
        return res.json({ message: "Login successful", role: "admin" });
      });
      return;
    }

    // If no user found
    res.status(401).json({ message: "Invalid credentials" });
  } catch (err) {
    next(err);
  }
});

// Get all instructors
app.get("/instructors", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM instructor");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Get all students
app.get("/students", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM student");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Get all admins
app.get("/admins", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM admins");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Add these routes to your server.js

// Create a new user
app.post("/users", async (req, res, next) => {
  const { email, password, name, role } = req.body;

  let table;
  switch (role) {
    case "instructor":
      table = "instructor";
      break;
    case "student":
      table = "student";
      break;
    case "administrator":
      table = "admins";
      break;
    default:
      return res.status(400).json({ error: "Invalid role" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO ${table} (email, password, name) VALUES ($1, $2, $3) RETURNING *`,
      [email, password, name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Update user details
app.put("/users/:id", async (req, res, next) => {
  const { id } = req.params;
  const { email, name, role } = req.body;

  let table;
  switch (role) {
    case "instructor":
      table = "instructor";
      break;
    case "student":
      table = "student";
      break;
    case "administrator":
      table = "admins";
      break;
    default:
      return res.status(400).json({ error: "Invalid role" });
  }

  try {
    const result = await pool.query(
      `UPDATE ${table} SET email = $1, name = $2 WHERE ${table}_id = $3 RETURNING *`,
      [email, name, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: "You need to log in" });
  }
};

// Session info route
app.get("/session-info", (req, res) => {
  res.json({
    userId: req.session.userId,
    userName: req.session.userName,
  });
});

// Protected route example
app.get("/profile", isAuthenticated, async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM instructor WHERE instructor_id= $1",
      [req.session.userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Logout route
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.json({ message: "Logout successful" });
  });
});

app.get("/healthz", function (req, res) {
  // do app logic here to determine if app is truly healthy
  // you should return 200 if healthy, and anything else will fail
  // if you want, you should be able to restrict this to localhost (include ipv4 and ipv6)

  res.send("I am happy and healthy\n");
});

/// Import class route
app.post("/import-class", async (req, res) => {
  const { students, courseName, courseId } = req.body;
  const instructorId = req.session.userId; // Retrieve instructor ID from session

  if (!instructorId) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    // Check if the class already exists for the given instructor and course
    let classQuery = await pool.query(
      "SELECT class_id FROM classes WHERE course_id = $1 AND instructor_id = $2",
      [courseId, instructorId]
    );

    let classId;

    if (classQuery.rows.length === 0) {
      // If class does not exist, create it
      const newClassQuery = await pool.query(
        "INSERT INTO classes (course_id, instructor_id, course_name) VALUES ($1, $2, $3) RETURNING class_id",
        [courseId, instructorId, courseName]
      );
      classId = newClassQuery.rows[0].class_id;
    } else {
      // If class exists, use the existing class_id
      classId = classQuery.rows[0].class_id;
    }

    // Validate and insert students
    const insertPromises = students.map(async (student) => {
      const { studentID, studentName } = student;

      if (!studentID || !studentName) {
        throw new Error(
          "Invalid student data: studentID and studentName are required"
        );
      }

      // Check if student already exists in the student table
      let studentQuery = await pool.query(
        "SELECT student_id FROM student WHERE student_id = $1",
        [studentID]
      );

      if (studentQuery.rows.length === 0) {
        // Insert the student into the student table if not exist
        await pool.query(
          "INSERT INTO student (student_id, name) VALUES ($1, $2)",
          [studentID, studentName]
        );
      }

      // Insert into enrollment table
      return pool.query(
        "INSERT INTO enrollment (class_id, student_id) VALUES ($1, $2)",
        [classId, studentID]
      );
    });

    await Promise.all(insertPromises);
    res.status(201).json({ message: "Class imported successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error importing class" });
  }
});

const PORT = process.env.PORT || 80;
console.log(`Starting server on port ${PORT}`);
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

module.exports = app;
