const pool = require('../../utils/db');
const { getStandardAverageData } = require('../examController');

// Mock the database query function
jest.mock('../../utils/db');

describe('Exam Controller - getStandardAverageData', () => {
  beforeEach(() => {
    pool.query.mockReset();
  });

  test('should return standard average data for the instructor', async () => {
    const req = {
      session: { userId: 1 }
    };
    const res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    const next = jest.fn();

    const mockData = [
      { examTitle: 'Midterm', averageScore: 85 },
      { examTitle: 'Final', averageScore: 75 },
    ];
    pool.query.mockResolvedValue({ rows: mockData });

    await getStandardAverageData(req, res, next);

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

    await getStandardAverageData(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
