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
app.use(session({
  store: new PgSession({
    pool: pool, // Connection pool
    tableName: 'session' // Use another table-name if you want to override default
  }),
  secret: 'secret', // Change this to a secure secret key
  resave: false, // This is true by default. It is recommended to set it to false
  saveUninitialized: false, // This is true by default. It is recommended to set it to false
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true, // Ensures the cookie is sent only over HTTP(S), not accessible to client JavaScript
    secure: false, // Set to true if using https
  }
}));

// User registration route
app.post("/register", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id",
      [email, password]
    );
    res.status(201).json({ userId: result.rows[0].id });
  } catch (err) {
    next(err);
  }
});

// User login route
app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM instructor WHERE email = $1", [email]);
    const user = result.rows[0];
    if (user && user.password === password) {
      // Save user information in the session
      req.session.userId = user.instructor_id;
      req.session.userName = user.name;
      req.session.save(err => {
        if (err) {
          return next(err);
        }
        res.json({ message: "Login successful" });
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
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
  res.json({ userId: req.session.userId, userName: req.session.userName });
});


// Protected route example
app.get("/profile", isAuthenticated, async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM instructor WHERE instructor_id= $1", [req.session.userId]);
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Logout route
app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.json({ message: "Logout successful" });
  });
});

app.get("/healthz", function(req, res) {
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
        "INSERT INTO classes (course_id, instructor_id) VALUES ($1, $2) RETURNING class_id",
        [courseId, instructorId]
      );
      classId = newClassQuery.rows[0].class_id;
    } else {
      // If class exists, use the existing class_id
      classId = classQuery.rows[0].class_id;
    }

    // Validate and insert students
    const insertPromises = students.map(async student => {
      const { studentID, studentName } = student;

      if (!studentID || !studentName) {
        throw new Error('Invalid student data: studentID and studentName are required');
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
