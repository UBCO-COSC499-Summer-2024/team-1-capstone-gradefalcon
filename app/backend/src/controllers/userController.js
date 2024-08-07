const pool = require('../utils/db');
const axios = require('axios');

const auth0Domain = process.env.REACT_APP_AUTH0_DOMAIN; // Auth0 domain from environment variables
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID; // Auth0 client ID from environment variables
const clientSecret = process.env.REACT_APP_AUTH0_CLIENT_SECRET; // Auth0 client secret from environment variables
const audience = `https://${auth0Domain}/api/v2/`; // Auth0 Management API audience

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

const updatingUser = async (req, res) => {
  const { userId, username } = req.body;

  try {
    // Update user details in Auth0
    await axios.patch(`https://${auth0Domain}/api/v2/users/${userId}`, {
      nickname: username
    }, {
      headers: {
        Authorization: `Bearer ${await getAuth0Token()}`
      }
    });

    // Update user details in the database
    const updateQuery = `
      UPDATE student
      SET name = $1
      WHERE auth0_id = $2
    `;
    await pool.query(updateQuery, [username, userId]);

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Trigger password reset email in Auth0
    await axios.post(`https://${auth0Domain}/dbconnections/change_password`, {
      client_id: clientId,
      email: email,
      connection: 'Username-Password-Authentication'
    });

    res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send password reset email', error: error.message });
  }
};

const getAuth0Token = async () => {
  const response = await axios.post(`https://${auth0Domain}/oauth/token`, {
    client_id: clientId,
    client_secret: clientSecret,
    audience: audience,
    grant_type: 'client_credentials'
  });

  return response.data.access_token;
};

module.exports = { getAllInstructors, getAllStudents, getAllAdmins, createUser, updateUser, resetPassword, updatingUser };
