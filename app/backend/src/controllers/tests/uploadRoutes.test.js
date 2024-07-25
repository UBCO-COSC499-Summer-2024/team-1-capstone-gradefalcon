const express = require('express');
const request = require('supertest');
const path = require('path');
const uploadRoutes = require('../../routes/uploadRoutes');
const { uploadFile, saveFileUrlToDatabase } = require('../../controllers/s3Controller');

jest.mock('../../controllers/s3Controller');

const app = express();
app.use(express.json());
app.use('/api/upload', uploadRoutes);

describe('POST /uploadExam', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should upload file and save URL to database', async () => {
    const folder = 'test-folder';
    const fileName = 'Exam (2).pdf'; // Updated to match the actual file name
    const fileUrl = `https://test-bucket.s3.amazonaws.com/${folder}/${fileName}`;
    const examID = 'test-exam-id';

    uploadFile.mockResolvedValue({ Location: fileUrl });
    saveFileUrlToDatabase.mockResolvedValue({ command: 'INSERT', rowCount: 1 });

    const response = await request(app)
      .post('/api/upload/uploadExam')
      .field('folder', folder)
      .field('examID', examID)
      .attach('file', path.join(__dirname, 'Exam (2).pdf'));

    expect(response.status).toBe(200);
    expect(uploadFile).toHaveBeenCalledWith(folder, fileName, expect.any(Buffer));
    expect(saveFileUrlToDatabase).toHaveBeenCalledWith(fileUrl, examID, 'scannedExam');
  });

  it('should return error if upload fails', async () => {
    const folder = 'test-folder';
    const fileName = 'Exam (2).pdf'; // Updated to match the actual file name
    const examID = 'test-exam-id';

    uploadFile.mockRejectedValue(new Error('S3 upload failed'));

    const response = await request(app)
      .post('/api/upload/uploadExam')
      .field('folder', folder)
      .field('examID', examID)
      .attach('file', path.join(__dirname, 'Exam (2).pdf'));

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('S3 upload failed');
  });
});

describe('POST /uploadExamKey', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should upload file and save URL to database in solution table', async () => {
    const folder = 'test-folder';
    const fileName = 'Exam (2).pdf'; // Updated to match the actual file name
    const fileUrl = `https://test-bucket.s3.amazonaws.com/${folder}/${fileName}`;
    const examID = 'test-exam-id';

    uploadFile.mockResolvedValue({ Location: fileUrl });
    saveFileUrlToDatabase.mockResolvedValue({ command: 'INSERT', rowCount: 1 });

    const response = await request(app)
      .post('/api/upload/uploadExamKey')
      .field('folder', folder)
      .field('examID', examID)
      .attach('file', path.join(__dirname, 'Exam (2).pdf'));

    expect(response.status).toBe(200);
    expect(uploadFile).toHaveBeenCalledWith(folder, fileName, expect.any(Buffer));
    expect(saveFileUrlToDatabase).toHaveBeenCalledWith(fileUrl, examID, 'solution');
  });
});
