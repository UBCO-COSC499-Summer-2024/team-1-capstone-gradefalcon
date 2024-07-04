const express = require('express');
const routes = express.Router();
const multer = require('multer');
const fs = require('fs');
const { uploadFile } = require('../controllers/s3Controller');

const upload = multer({ dest: 'uploads/' });

// Route to handle file upload
routes.post('/uploadExam', upload.single('file'), async (req, res) => {
  const { folder } = req.body;
  const fileContent = fs.readFileSync(req.file.path);
  const fileName = req.file.originalname;

  console.log(`Received file: ${fileName}, uploading to folder: ${folder}`);

  try {
    const result = await uploadFile(folder, fileName, fileContent);
    // Save the file URL to the database (assuming you have this function)
    const fileUrl = result.Location;
    console.log(`File uploaded successfully to S3. URL: ${fileUrl}`);
    await saveFileUrlToDatabase(fileUrl, folder); // Implement this function based on your database setup
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error uploading file:', error); // Log the error to the console
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = routes;
