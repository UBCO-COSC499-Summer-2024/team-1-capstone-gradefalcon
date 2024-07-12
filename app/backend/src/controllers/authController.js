const pool = require('../utils/db');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt'); // Commented out
// const rateLimit = require('express-rate-limit'); // Commented out

// // Rate limiter middleware (commented out)
// const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5, // limit each IP to 5 login requests per windowMs
//   message: "Too many login attempts from this IP, please try again after 15 minutes",
// });

//const bcrypt = require('bcrypt'); // Uncomment when using hashing
const signup = async (req, res, next) => {
  const { email, password, name } = req.body;

  // Validate input types and lengths
  if (typeof email !== 'string' || typeof password !== 'string' || typeof name !== 'string') {
    return res.status(400).json({ message: "Invalid/missing input types" });
  }
  if (!email || !password || !name) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  if (email.length > 255 || password.length > 255 || name.length > 255) {
    return res.status(400).json({ message: "Input length exceeds limit" });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  if (!validatePassword(password)) {
    return res.status(400).json({ message: "Password does not meet the requirements" });
  }

  try {
    // Check if user already exists
    let existingUser = await pool.query("SELECT * FROM student WHERE email = $1", [email]);
    if (!existingUser || existingUser.rows.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10); // Commented out hashing

    // Insert new user into the database
    let result = await pool.query(
      "INSERT INTO student (email, password, name) VALUES ($1, $2, $3) RETURNING student_id",
      [email, password, name] // Use plaintext password for now
    );

    // Check if the insert was successful
    if (!result || result.rows.length === 0) {
      throw new Error('Failed to create user');
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: result.rows[0].student_id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    res.status(201).json({ token });
  } catch (err) {
    console.error('Error during signup:', err); // Detailed error logging
    next(err);
  }
};


// CSRF protection, rate limiting, and input sanitization can be implemented at the middleware level


const login = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate input types and presence of fields
  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: "Missing/Invalid input types" }); 
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    // Function to handle the session setup and response
    const handleUserLogin = (user, role) => {
      req.session.userId = user.id;
      req.session.userName = user.name;
      req.session.role = role;
      req.session.save(err => {
        if (err) return next(err);
        return res.json({ message: "Login successful", role: role });
      });
    };

    // Sequentially check each user table
    let result = await pool.query("SELECT * FROM instructor WHERE email = $1", [email]);
    let user = result.rows[0];
    if (user && user.password === password) { // Commented out password comparison with hashing
      return handleUserLogin({ id: user.instructor_id, name: user.name }, 'instructor');
    }

    result = await pool.query("SELECT * FROM student WHERE email = $1", [email]);
    user = result.rows[0];
    if (user && user.password === password) { // Commented out password comparison with hashing
      return handleUserLogin({ id: user.student_id, name: user.name }, 'student');
    }

    result = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);
    user = result.rows[0];
    if (user && user.password === password) { // Commented out password comparison with hashing
      return handleUserLogin({ id: user.admin_id, name: user.name }, 'admin');
    }

    res.status(401).json({ message: "Invalid credentials" });
  } catch (err) {
    console.error('Error during login:', err); // Log the error
    next(err);
  }
};

const logout = (req, res) => {
  try { 
    req.session.destroy();
  } catch (err) {
    console.error('Error destroying session:', err);
    return res.status(500).json({ message: "Logout failed due to server error" });
  }
  return res.json({ message: "Logout successful" }); //implicitly returns status 200
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

module.exports = { login, signup, logout /*, loginLimiter*/ };
