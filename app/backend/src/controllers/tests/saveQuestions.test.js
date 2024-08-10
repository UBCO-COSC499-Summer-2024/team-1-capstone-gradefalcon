// Import necessary modules and the function to test
const { saveQuestions } = require('../examController');
const pool = require('../../utils/db'); // Ensure pool is imported correctly

jest.mock('../../utils/db', () => {
  return {
    query: jest.fn(),
  };
});

describe('saveQuestions', () => {
  it('should handle errors when saving questions and marking schemes', async () => {
    const req = {
      body: {
        questions: {},
        classID: 1,
        examTitle: 'Math Test',
        numQuestions: 1,
        totalMarks: 10,
        markingSchemes: {},
        template: 'default',
        canViewExam: true,
        canViewAnswers: true
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    pool.query.mockRejectedValueOnce(new Error('Database error')); // Properly mock the pool.query function

    await saveQuestions(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Failed to save questions and marking schemes." });
  });
});
