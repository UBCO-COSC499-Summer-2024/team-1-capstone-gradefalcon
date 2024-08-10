const { saveQuestions, newExam, fetchAllExams  } = require('../examController');
const pool = require('../../utils/db');

// Mock the database pool
jest.mock('../../utils/db', () => ({
  query: jest.fn(),
}));

describe('saveQuestions', () => {
  let mockQuery;
  let mockRequest;
  let mockResponse;
  let mockNext;

  beforeEach(() => {
    mockQuery = pool.query;
    mockRequest = {
      body: {
        questions: {
          1: { question: "What is 2+2?", option: "4" },
          2: { question: "What is the capital of France?", option: "Paris" },
        },
        classID: 'class-123',
        examTitle: 'Math Exam',
        numQuestions: 2,
        totalMarks: 10,
        markingSchemes: { 1: "Scheme 1", 2: "Scheme 2" },
        template: 'template-123',
        canViewExam: true,
        canViewAnswers: false,
      },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('should save questions and marking schemes successfully', async () => {
    // Mock database responses
    mockQuery.mockResolvedValueOnce({ rows: [{ exam_id: 'exam-123' }] }); // Mock for INSERT INTO exam
    mockQuery.mockResolvedValueOnce({ rows: [] }); // Mock for INSERT INTO solution

    await saveQuestions(mockRequest, mockResponse, mockNext);

    expect(mockQuery).toHaveBeenCalledWith(
      "INSERT INTO exam (class_id, exam_title, total_questions, total_marks, template, viewing_options) VALUES ($1, $2, $3, $4, $5, $6) RETURNING exam_id",
      ['class-123', 'Math Exam', 2, 10, 'template-123', JSON.stringify({ canViewExam: true, canViewAnswers: false })]
    );
    expect(mockQuery).toHaveBeenCalledWith(
      "INSERT INTO solution (exam_id, answers, marking_schemes) VALUES ($1, $2, $3)",
      ['exam-123', ['What is 2+2?:4', 'What is the capital of France?:Paris'], JSON.stringify({ 1: "Scheme 1", 2: "Scheme 2" })]
    );
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Questions and marking schemes saved successfully." });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle errors when saving questions and marking schemes', async () => {
    const mockError = new Error('Database error');
    mockQuery.mockRejectedValueOnce(mockError);

    await saveQuestions(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Failed to save questions and marking schemes." });
    expect(mockNext).not.toHaveBeenCalled();
  });
});

describe('newExam', () => {
  let mockQuery;
  let mockRequest;
  let mockResponse;
  let mockNext;

  beforeEach(() => {
    mockQuery = pool.query;
    mockRequest = {
      body: {
        exam_id: 'exam-123',
        student_id: 'student-456',
        grade: 85,
      },
    };
    mockResponse = {
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('should insert a new exam result for a student', async () => {
    const mockResult = {
      rows: [{
        exam_id: 'exam-123',
        student_id: 'student-456',
        grade: 85,
      }],
    };

    mockQuery.mockResolvedValueOnce(mockResult);

    await newExam(mockRequest, mockResponse, mockNext);

    expect(mockQuery).toHaveBeenCalledWith(
      "INSERT INTO studentResults (exam_id, student_id, grade) VALUES ($1, $2, $3) RETURNING *",
      ['exam-123', 'student-456', 85]
    );
    expect(mockResponse.json).toHaveBeenCalledWith(mockResult.rows[0]);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle errors when inserting a new exam result', async () => {
    const mockError = new Error('Database error');
    mockQuery.mockRejectedValueOnce(mockError);

    await newExam(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(mockError);
  });
  
});
describe('fetchAllExams', () => {
    let mockQuery;
    let mockRequest;
    let mockResponse;
    let mockNext;
  
    beforeEach(() => {
      mockQuery = pool.query;
      mockRequest = {
        params: {
          classID: 'class-123',
        },
      };
      mockResponse = {
        json: jest.fn(),
      };
      mockNext = jest.fn();
    });
  
    it('should fetch all exams for a class', async () => {
      const mockExams = [
        { exam_id: 'exam-1', exam_title: 'Math Test', total_marks: 100 },
        { exam_id: 'exam-2', exam_title: 'Science Quiz', total_marks: 50 },
      ];
  
      mockQuery.mockResolvedValueOnce({ rows: mockExams });
  
      await fetchAllExams(mockRequest, mockResponse, mockNext);
  
      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT exam_id, exam_title, total_marks FROM exam WHERE class_id = $1',
        ['class-123']
      );
      expect(mockResponse.json).toHaveBeenCalledWith(mockExams);
      expect(mockNext).not.toHaveBeenCalled();
    });
  
    it('should handle database errors when fetching exams', async () => {
      const mockError = new Error('Database error');
      mockQuery.mockRejectedValueOnce(mockError);
  
      await fetchAllExams(mockRequest, mockResponse, mockNext);
  
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
});
