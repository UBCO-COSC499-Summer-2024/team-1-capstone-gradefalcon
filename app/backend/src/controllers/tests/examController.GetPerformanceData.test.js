const pool = require('../../utils/db');
const { getPerformanceData } = require('../examController');

// Mock the database query function
jest.mock('../../utils/db');

describe('Exam Controller - getPerformanceData', () => {
  beforeEach(() => {
    pool.query.mockReset();
  });

  test('should return performance data for the instructor', async () => {
    const req = {
      session: { userId: 1 }
    };
    const res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    const next = jest.fn();

    const mockData = [
      { courseName: 'Math 101', averageScore: 90 },
      { courseName: 'Science 101', averageScore: 85 },
    ];
    pool.query.mockResolvedValue({ rows: mockData });

    await getPerformanceData(req, res, next);

    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1]);
    expect(res.status).not.toHaveBeenCalled(); // res.status is not set explicitly in your function
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  test('should handle errors', async () => {
    const req = {
      session: { userId: 1 }
    };
    const res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    const next = jest.fn();

    const mockError = new Error('Database error');
    pool.query.mockRejectedValue(mockError);

    await getPerformanceData(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});

