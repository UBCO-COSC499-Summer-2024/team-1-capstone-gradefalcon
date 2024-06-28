const pool = require('../utils/db');
const jwt = require('jsonwebtoken');

// User registration controller
const signup = async (req, res, next) => {
  const { email, password, name } = req.body;
  try {
    let existingUser = await pool.query("SELECT * FROM student WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }
    let result = await pool.query("INSERT INTO student (email, password, name) VALUES ($1, $2, $3) RETURNING student_id", [email, password, name]);
    const token = jwt.sign({ userId: result.rows[0].student_id }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

// User login controller
const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    let result = await pool.query("SELECT * FROM instructor WHERE email = $1", [email]);
    let user = result.rows[0];
    if (user && user.password === password) {
      req.session.userId = user.instructor_id;
      req.session.userName = user.name;
      req.session.role = 'instructor';
      req.session.save(err => {
        if (err) return next(err);
        return res.json({ message: "Login successful", role: 'instructor' });
      });
      return;
    }

    result = await pool.query("SELECT * FROM student WHERE email = $1", [email]);
    user = result.rows[0];
    if (user && user.password === password) {
      req.session.userId = user.student_id;
      req.session.userName = user.name;
      req.session.role = 'student';
      req.session.save(err => {
        if (err) return next(err);
        return res.json({ message: "Login successful", role: 'student' });
      });
      return;
    }

    result = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);
    user = result.rows[0];
    if (user && user.password === password) {
      req.session.userId = user.admin_id;
      req.session.userName = user.name;
      req.session.role = 'admin';
      req.session.save(err => {
        if (err) return next(err);
        return res.json({ message: "Login successful", role: 'admin' });
      });
      return;
    }

    res.status(401).json({ message: "Invalid credentials" });
  } catch (err) {
    next(err);
  }
};

// User logout controller
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.json({ message: "Logout successful" });
  });
};

module.exports = { login, signup, logout };
