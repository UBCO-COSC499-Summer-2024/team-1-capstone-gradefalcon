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

app.post("/classes", async (req, res, next) => {
  try {
    const instructorId = 1; // Assuming you want to hardcode the instructor_id as 1
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
    const result = await pool.query(
      "SELECT * FROM instructor WHERE email = $1",
      [email]
    );
    const user = result.rows[0];
    if (user && user.password === password) {
      // Save user information in the session
      req.session.userId = user.instructor_id;
      req.session.userName = user.name;

      req.session.save((err) => {
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

const PORT = process.env.PORT || 80;
console.log(`Starting server on port ${PORT}`);
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

module.exports = app;
