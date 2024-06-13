// simple node web server that displays hello world
// optimized for Docker image

const express = require("express");
// this example uses express web framework so we know what longer build times
// do and how Dockerfile layer ordering matters. If you mess up Dockerfile ordering
// you'll see long build times on every code change + build. If done correctly,
// code changes should be only a few seconds to build locally due to build cache.

const morgan = require("morgan");
// morgan provides easy logging for express, and by default it logs to stdout
// which is a best practice in Docker. Friends don't let friends code their apps to
// do app logging to files in containers.

const database = require("./database");

// Appi
const app = express();

//Database
const { Pool } = require("pg");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const config = require("./config");

// PostgreSQL pool setup
const pool = new Pool(config.database);

app.use(morgan("common"));
app.use(bodyParser.json());

const secretKey = process.env.JWT_SECRET || "secret"; // strong secret key store it in environment variables

//test database connection
// pool.query("select * from exam", (err, res) => {

//   if (err) {
//     console.log(err);
//   } else {
//     console.log(res.rows);
//     pool.end()
//   }
// });

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

// User login route without encryption
app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM instructor WHERE email = $1", [email]);
    const user = result.rows[0];
    if (user && user.password === password) {
      const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: "1h" });
      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    next(err);
  }
});

// Middleware to protect routes
const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Protected route example
app.get("/profile", authenticateJWT, async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [req.userId]);
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.get("/healthz", function(req, res) {
  // do app logic here to determine if app is truly healthy
  // you should return 200 if healthy, and anything else will fail
  // if you want, you should be able to restrict this to localhost (include ipv4 and ipv6)
  
  res.send("I am happy and healthy\n");
});


const PORT = process.env.PORT || 5001;
console.log(`Starting server on port ${PORT}`);
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

module.exports = app;
