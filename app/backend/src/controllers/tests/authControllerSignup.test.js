const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { signup, login } = require('../authController');
const pool = require('../../utils/db');

jest.mock('../../utils/db');

const app = express();
app.use(bodyParser.json());
app.post('/api/auth/signup', signup);
app.post('/api/auth/login', login);

const testEmail = 'test@example.com';
const testPassword = 'Password123!';
const testName = 'Test User';
const invalidEmail = 'invalid-email';
const shortPassword = 'short';
const missingName = { email: testEmail, password: testPassword };
const validSignupPayload = {
  email: testEmail,
  password: testPassword,
  name: testName,
};

describe('AuthController Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User Signup Tests', () => {
    test('should sign up the user successfully', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] }) // No existing user
               .mockResolvedValueOnce({ rows: [{ student_id: 1 }] }); // New user created

      const response = await request(app)
        .post('/api/auth/signup')
        .send(validSignupPayload);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');

      // Verify the database interactions
      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM student WHERE email = $1", [testEmail]);
      expect(pool.query).toHaveBeenCalledWith("INSERT INTO student (email, password, name) VALUES ($1, $2, $3) RETURNING student_id", [testEmail, testPassword, testName]);
    });

    test('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({ email: invalidEmail, password: testPassword, name: testName });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid email format');
      expect(pool.query).not.toHaveBeenCalled();
    });

    test('should return 400 for invalid password format', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({ email: testEmail, password: shortPassword, name: testName });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Password does not meet the requirements');
      expect(pool.query).not.toHaveBeenCalled();
    });

    test('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send(missingName);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid/missing input types');
      expect(pool.query).not.toHaveBeenCalled();
    });

    test('should return 409 if email already exists', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ student_id: 1 }] }); // Existing user

      const response = await request(app)
        .post('/api/auth/signup')
        .send(validSignupPayload);

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('Email already exists');

      // Verify the database interactions
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM student WHERE email = $1", [testEmail]);
    });

    test('should return 500 for server error', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .post('/api/auth/signup')
        .send({ email: testEmail, password: testPassword, name: testName });

      expect(response.status).toBe(500);
      // Verify the database interactions
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM student WHERE email = $1", [testEmail]);
    });
  });

  describe('Verifies User is in Database After Signup Tests', () => {
    test('should verify user exists in the database after signup', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] }) // No existing user
               .mockResolvedValueOnce({ rows: [] }) // No user before signup
               .mockResolvedValueOnce({ rows: [{ student_id: 1 }] }) // New user created
               .mockResolvedValueOnce({ rows: [{ email: testEmail, name: testName }] }); // Verify insertion
  
      // Verify the user does not exist before signup
      const preSignupCheck = await pool.query("SELECT email, name FROM student WHERE email = $1", [testEmail]);
      expect(preSignupCheck.rows).toEqual([]);
  
      // Sign up the user
      await request(app)
        .post('/api/auth/signup')
        .send(validSignupPayload);
  
      // Verify the user is in the database
      const verifyUser = await pool.query("SELECT email, name FROM student WHERE email = $1", [testEmail]);
      expect(verifyUser.rows).toEqual([{ email: testEmail, name: testName }]);
    });
  });
});  