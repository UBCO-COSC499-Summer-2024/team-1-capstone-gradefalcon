const pool = require('../../utils/db');
const { getStudentGrades } = require('../examController');

// Mock the database query function
jest.mock('../../utils/db');

describe('Exam Controller - getStudentGrades', () => {
  beforeEach(() => {
    pool.query.mockReset();
  });

  test('should return student grades for the specified class', async () => {
    const req = {
      params: { studentId: 1 },
      query: { classId: 1 }
    };
    const res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    const next = jest.fn();

    const mockData = [
      { title: 'Midterm', status: 'submitted', score: 85, total: 100 },
      { title: 'Final', status: 'missing', score: 0, total: 100 },
    ];
    pool.query.mockResolvedValue({ rows: mockData });

    await getStudentGrades(req, res, next);

    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1, 1]);
    expect(res.status).not.toHaveBeenCalled(); // res.status is not set explicitly in your function
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  test('should handle errors', async () => {
    const req = {
      params: { studentId: 1 },
      query: { classId: 1 }
    };
    const res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    const next = jest.fn();

    const mockError = new Error('Database error');
    pool.query.mockRejectedValue(mockError);

    await getStudentGrades(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
