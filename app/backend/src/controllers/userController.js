const pool = require('../utils/db');

const getAllInstructors = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM instructor");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

const getAllStudents = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM student");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

const getAllAdmins = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM admins");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllInstructors, getAllStudents, getAllAdmins };
