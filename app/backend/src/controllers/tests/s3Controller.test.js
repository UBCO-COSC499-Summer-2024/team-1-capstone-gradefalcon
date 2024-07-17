const { uploadFile, listObjects, saveFileUrlToDatabase } = require('../../controllers/s3Controller');
const { S3Client, PutObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const pool = require('../../utils/db');

jest.mock('@aws-sdk/client-s3');
jest.mock('../../utils/db');

describe('s3Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('uploadFile uploads file to S3 and returns URL', async () => {
    const folder = 'testingFiles';
    const fileName = 'Exam (2).pdf';
    const fileContent = 'dummy content';
    const expectedUrl = `https://gradefalcon-storage.s3.amazonaws.com/${folder}/${fileName}`;

    S3Client.prototype.send = jest.fn().mockResolvedValue({ Location: expectedUrl });

    const result = await uploadFile(folder, fileName, fileContent);

    expect(result.Location).toBe(expectedUrl);
  });

  test('listObjects lists objects in S3', async () => {
    const folder = 'test-folder';
    const objects = [{ Key: 'test-folder/file1.pdf' }, { Key: 'test-folder/file2.pdf' }];

    S3Client.prototype.send = jest.fn().mockResolvedValue({ Contents: objects });

    const result = await listObjects(folder);

    expect(result.Contents).toEqual(objects);
  });

  test('saveFileUrlToDatabase saves file URL to database', async () => {
    const fileUrl = 'https://gradefalcon-storage.s3.amazonaws.com/test-folder/test-file.pdf';
    const examID = 'test-exam-id';
    const tableName = 'solution';
    const query = `INSERT INTO ${tableName} (exam_id, filepath) VALUES ($1, $2)`;
    const values = [examID, fileUrl];

    pool.query.mockResolvedValue({ command: 'INSERT', rowCount: 1 });

    await saveFileUrlToDatabase(fileUrl, examID, tableName);

    expect(pool.query).toHaveBeenCalledWith(query, values);
  });
});
