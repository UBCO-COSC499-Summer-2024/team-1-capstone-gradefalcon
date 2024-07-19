const pool = require('../../utils/db');
const { getCoursesForStudent } = require('../courseController');

// Mock the database query function
jest.mock('../../utils/db');

describe('Course Controller - getCoursesForStudent', () => {
  beforeEach(() => {
    pool.query.mockReset();
  });

  test('should return courses for the student', async () => {
    const req = {
      params: { studentId: 1 }
    };
    const res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    const next = jest.fn();

    const mockData = [
      { class_id: 1, course_id: 'CS101', course_name: 'Computer Science 101' },
      { class_id: 2, course_id: 'MATH101', course_name: 'Mathematics 101' },
    ];
    pool.query.mockResolvedValue({ rows: mockData });

    await getCoursesForStudent(req, res, next);

    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1]);
    expect(res.status).not.toHaveBeenCalled(); // res.status is not set explicitly in your function
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  test('should handle errors', async () => {
    const req = {
      params: { studentId: 1 }
    };
    const res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    const next = jest.fn();

    const mockError = new Error('Database error');
    pool.query.mockRejectedValue(mockError);

    await getCoursesForStudent(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
