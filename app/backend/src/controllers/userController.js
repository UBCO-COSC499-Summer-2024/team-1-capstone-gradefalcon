const pool = require('../utils/db');

// Get all instructors
const getAllInstructors = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM instructor");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Get all students
const getAllStudents = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM student");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Get all admins
const getAllAdmins = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM admins");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Create a new user
const createUser = async (req, res, next) => {
  const { email, password, name, role } = req.body;

  let table;
  switch (role) {
    case 'instructor':
      table = 'instructor';
      break;
    case 'student':
      table = 'student';
      break;
    case 'administrator':
      table = 'admins';
      break;
    default:
      return res.status(400).json({ error: "Invalid role" });
  }

  try {
    const result = await pool.query(`INSERT INTO ${table} (email, password, name) VALUES ($1, $2, $3) RETURNING *`, [email, password, name]);
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Update user details
const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { email, name, role } = req.body;

  let table;
  switch (role) {
    case 'instructor':
      table = 'instructor';
      break;
    case 'student':
      table = 'student';
      break;
    case 'administrator':
      table = 'admins';
      break;
    default:
      return res.status(400).json({ error: "Invalid role" });
  }

  try {
    const result = await pool.query(`UPDATE ${table} SET email = $1, name = $2 WHERE ${table}_id = $3 RETURNING *`, [email, name, id]);
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllInstructors, getAllStudents, getAllAdmins, createUser, updateUser };