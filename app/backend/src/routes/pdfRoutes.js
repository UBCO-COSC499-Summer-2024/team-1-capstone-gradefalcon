const express = require('express');
const multer = require('multer');
const { uploadPdf } = require('../controllers/pdfController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload-pdf', upload.single('pdf'), uploadPdf);

module.exports = router;
