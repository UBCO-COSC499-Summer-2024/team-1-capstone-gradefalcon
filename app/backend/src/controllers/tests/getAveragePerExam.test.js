const { Pool } = require('pg');
const pool = new Pool();
module.exports = pool;

// Import necessary modules and the function to test
const { getAveragePerExam } = require('../examController');
const pool = require('../../utils/db'); // Ensure pool is imported correctly

describe('getAveragePerExam', () => {
    it('should return average scores per exam for an instructor', async () => {
      const req = {
        auth: { sub: 'instructor1' }
      };
      const res = {
        json: jest.fn(),
      };
      const mockResult = {
        rows: [{
          examTitle: 'Math Test',
          averageScore: 90,
        }],
      };
      pool.query.mockResolvedValueOnce(mockResult);
  
      await getAveragePerExam(req, res);
  
      expect(pool.query).toHaveBeenCalledWith(
        `
        SELECT e.exam_title AS "examTitle", ROUND(AVG(sr.grade)::numeric, 1) AS "averageScore"
        FROM studentResults sr
        JOIN exam e ON sr.exam_id = e.exam_id
        JOIN classes c ON e.class_id = c.class_id
        WHERE c.instructor_id = $1
        GROUP BY e.exam_title
        ORDER BY e.exam_title
      `,
        ['instructor1']
      );
      expect(res.json).toHaveBeenCalledWith(mockResult.rows);
    });
  
    it('should handle errors in getAveragePerExam', async () => {
      const req = {
        auth: { sub: 'instructor1' }
      };
      const res = {};
      const next = jest.fn();
  
      pool.query.mockRejectedValueOnce(new Error('Database error'));
  
      await getAveragePerExam(req, res, next);
  
      expect(next).toHaveBeenCalledWith(new Error('Database error'));
    });
  });
  