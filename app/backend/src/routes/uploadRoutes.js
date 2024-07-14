const express = require('express');
const routes = express.Router();
const multer = require('multer');
const fs = require('fs');
const { uploadFile, saveFileUrlToDatabase } = require('../controllers/s3Controller');

const upload = multer({ dest: 'uploads/' });

// Route to handle file upload
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

    await saveFileUrlToDatabase(fileUrl, examID, 'scannedExam'); // Specify the table for scanned exams

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

routes.post('/uploadExamKey', upload.single('file'), async (req, res) => {
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

    await saveFileUrlToDatabase(fileUrl, examID, 'solution'); // Specify the table for solutions

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = routes;
