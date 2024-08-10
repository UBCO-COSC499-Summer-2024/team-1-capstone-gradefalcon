// Import necessary modules and the function to test
const { getStudentGrades } = require('../examController');
const pool = require('../../utils/db'); // Ensure pool is imported correctly

describe('getStudentGrades', () => {
    it('should return grades for a student in a class', async () => {
      const req = {
        params: { studentId: 1 },
        query: { classId: 1 },
      };
      const res = {
        json: jest.fn(),
      };
      const mockResult = {
        rows: [{
          title: 'Math Test',
          status: 'submitted',
          score: 95,
          total: 100,
        }],
      };
      pool.query.mockResolvedValueOnce(mockResult);
  
      await getStudentGrades(req, res);
  
      expect(pool.query).toHaveBeenCalledWith(
        `
        SELECT e.exam_title AS title, 
               CASE 
                 WHEN sr.grade IS NULL THEN 'missing' 
                 ELSE 'submitted' 
               END AS status, 
               COALESCE(sr.grade, 0) AS score, 
               e.total_marks AS total
        FROM exam e
        LEFT JOIN studentResults sr ON e.exam_id = sr.exam_id AND sr.student_id = $1
        WHERE e.class_id = $2
      `,
        [1, 1]
      );
      expect(res.json).toHaveBeenCalledWith(mockResult.rows);
    });
  
    it('should handle errors in getStudentGrades', async () => {
      const req = {
        params: { studentId: 1 },
        query: { classId: 1 },
      };
      const res = {};
      const next = jest.fn();
  
      pool.query.mockRejectedValueOnce(new Error('Database error'));
  
      await getStudentGrades(req, res, next);
  
      expect(next).toHaveBeenCalledWith(new Error('Database error'));
    });
  });
  