const pool = require('../utils/db');
const { S3Client, PutObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const s3 = require("../awsConfig");

const uploadFile = async (folder, fileName, fileContent) => {
  const params = {
    Bucket: 'gradefalcon-storage',
    Key: `${folder}/${fileName}`,
    Body: fileContent,
  };

  const command = new PutObjectCommand(params);
  const result = await s3.send(command);

  const fileUrl = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
  return { ...result, Location: fileUrl };
};

const listObjects = async (folder) => {
  const params = {
    Bucket: 'gradefalcon-storage',
    Prefix: `${folder}`,
  };

  const command = new ListObjectsV2Command(params);
  const result = await s3.send(command);
  return result;
};

const saveFileUrlToDatabase = async (fileUrl, examID, tableName = 'scannedExam') => {
  const query = `INSERT INTO ${tableName} (exam_id, filepath) VALUES ($1, $2)`;
  const values = [examID, fileUrl];

  try {
    const res = await pool.query(query, values);
    console.log(`File URL saved to ${tableName} table:`, res);
  } catch (err) {
    console.error('Error saving file URL to database:', err);
  }
};

module.exports = { uploadFile, listObjects, saveFileUrlToDatabase };
