// Import necessary modules and the function to test
const { newExam } = require('../examController');
const pool = require('../../utils/db'); // Ensure pool is imported correctly

jest.mock('../../utils/db', () => {
  return {
    query: jest.fn(),
  };
});

describe('newExam', () => {
    it('should insert a new exam and return the result', async () => {
      const req = {
        body: {
          exam_id: 1,
          student_id: 1,
          grade: 95,
        },
      };
      const res = {
        json: jest.fn(),
      };
      const mockResult = {
        rows: [{
          exam_id: 1,
          student_id: 1,
          grade: 95,
        }],
      };
      pool.query.mockResolvedValueOnce(mockResult);
  
      await newExam(req, res);
  
      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO studentResults (exam_id, student_id, grade) VALUES ($1, $2, $3) RETURNING *",
        [1, 1, 95]
      );
      expect(res.json).toHaveBeenCalledWith(mockResult.rows[0]);
    });
  
    it('should handle errors in newExam', async () => {
      const req = {
        body: {
          exam_id: 1,
          student_id: 1,
          grade: 95,
        },
      };
      const res = {};
      const next = jest.fn();
  
      pool.query.mockRejectedValueOnce(new Error('Database error'));
  
      await newExam(req, res, next);
  
      expect(next).toHaveBeenCalledWith(new Error('Database error'));
    });
  });
  