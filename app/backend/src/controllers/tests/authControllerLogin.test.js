const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const { login } = require('../authController');
const pool = require('../../utils/db');

jest.mock('../../utils/db');

const app = express();
app.use(bodyParser.json());

// Mock session middleware
app.use(session({
  secret: 'testsecret',
  resave: false,
  saveUninitialized: true,
}));

app.post('/api/auth/login', login);

describe('AuthController Login Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Successful login as Instructor', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ instructor_id: 1, email: 'instructor@ubc.ca', password: 'instructor', name: 'Instructor' }] });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'instructor@ubc.ca', password: 'instructor' });

    expect(response.status).toBe(200);
    expect(response.body.role).toBe('instructor');
    expect(response.body.message).toBe("Login successful");
    expect(pool.query).toHaveBeenCalledWith("SELECT * FROM instructor WHERE email = $1", ['instructor@ubc.ca']);
  });

  test('Successful login as Student', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    pool.query.mockResolvedValueOnce({ rows: [{ student_id: 2, email: 'student@ubc.ca', password: 'student', name: 'Student' }] });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'student@ubc.ca', password: 'student' });

    expect(response.status).toBe(200);
    expect(response.body.role).toBe('student');
    expect(response.body.message).toBe("Login successful");
    expect(pool.query).toHaveBeenCalledWith("SELECT * FROM student WHERE email = $1", ['student@ubc.ca']);
  });

  test('Successful login as Admin', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    pool.query.mockResolvedValueOnce({ rows: [] });
    pool.query.mockResolvedValueOnce({ rows: [{ admin_id: 3, email: 'admin@ubc.ca', password: 'admin', name: 'Admin' }] });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@ubc.ca', password: 'admin' });

    expect(response.status).toBe(200);
    expect(response.body.role).toBe('admin');
    expect(response.body.message).toBe("Login successful");
    expect(pool.query).toHaveBeenCalledWith("SELECT * FROM admins WHERE email = $1", ['admin@ubc.ca']);
  });

  test('Invalid login credentials', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    pool.query.mockResolvedValueOnce({ rows: [] });
    pool.query.mockResolvedValueOnce({ rows: [] });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'invalid@ubc.ca', password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
  });

  test('Missing email field', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ password: 'student' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing/Invalid input types");
  });

  test('Missing password field', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'student@ubc.ca' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing/Invalid input types");
  });

  test('Empty email and password fields', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: '', password: '' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing/Invalid input types");
  });

  test('SQL Injection attempt', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    pool.query.mockResolvedValueOnce({ rows: [] });
    pool.query.mockResolvedValueOnce({ rows: [] });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@ubc.ca', password: "' OR '1'='1" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
  });

  test('Login attempt with incorrect variable types', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 12345, password: true });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing/Invalid input types");
  });

  /*
  // Uncomment these tests when rate limiting and hashing are implemented

  test('Rate limiting triggered', async () => {
    const req = {
      body: { email: 'student@ubc.ca', password: 'student' },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    // Simulate rate limiting
    const loginLimiter = jest.fn((req, res, next) => {
      res.status(429).json({ message: "Too many login attempts from this IP, please try again after 15 minutes" });
    });

    await loginLimiter(req, res, () => {});

    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith({ message: "Too many login attempts from this IP, please try again after 15 minutes" });
  });

  test('Successful login with hashed password', async () => {
    const req = {
      body: { email: 'student@ubc.ca', password: 'student' },
      session: { save: jest.fn((cb) => cb()) }
    };
    const res = { json: jest.fn() };
    const hashedPassword = await bcrypt.hash('student', 10);
    pool.query.mockResolvedValueOnce({ rows: [{ student_id: 2, email: 'student@ubc.ca', password: hashedPassword, name: 'Student' }] });
    bcrypt.compare.mockResolvedValueOnce(true);

    await login(req, res);

    expect(req.session.userId).toBe(2);
    expect(req.session.userName).toBe('Student');
    expect(req.session.role).toBe('student');
    expect(res.json).toHaveBeenCalledWith({ message: "Login successful", role: 'student' });
  });
  */

});
