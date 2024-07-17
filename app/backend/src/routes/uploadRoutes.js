const express = require('express');
const routes = express.Router();
const multer = require('multer');
const fs = require('fs');
const { uploadFile, saveFileUrlToDatabase } = require('../controllers/s3Controller');
const pool = require('../utils/db');

const upload = multer({ dest: 'uploads/' });

routes.post('/uploadExam', upload.single('file'), async (req, res) => {
  const { folder, fileName: customFileName, examID } = req.body;
  const file = req.file;
  const fileContent = fs.readFileSync(file.path);

  const fileName = customFileName || file.originalname;

  console.log(`Received file: ${fileName}, uploading to folder: ${folder}`);

  try {
    const result = await uploadFile(folder, fileName, fileContent);
    fs.unlinkSync(file.path); // Remove the temporary file after upload
    const fileUrl = result.Location;
    console.log(`File uploaded successfully to S3. URL: ${fileUrl}`);

    await saveFileUrlToDatabase(fileUrl, examID, 'scannedExam');

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

routes.post('/uploadExamKey', upload.single('file'), async (req, res) => {
  let { folder, fileName: customFileName, examID, examTitle, classID } = req.body;
  const file = req.file;
  const fileContent = fs.readFileSync(file.path);

  const fileName = customFileName || file.originalname;

  console.log(`Received file: ${fileName}, uploading to folder: ${folder}`);

  try {
    // Insert a new exam if examID is not provided
    if (!examID) {
      const insertQuery = 'INSERT INTO exam (exam_title, class_id) VALUES ($1, $2) RETURNING exam_id';
      const insertValues = [examTitle, classID];
      const insertResult = await pool.query(insertQuery, insertValues);
      examID = insertResult.rows[0].exam_id;
    }

    const result = await uploadFile(folder, fileName, fileContent);
    fs.unlinkSync(file.path); // Remove the temporary file after upload
    const fileUrl = result.Location;
    console.log(`File uploaded successfully to S3. URL: ${fileUrl}`);

    await saveFileUrlToDatabase(fileUrl, examID, 'solution');

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = routes;
