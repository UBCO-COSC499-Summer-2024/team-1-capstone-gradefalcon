const path = require('path');
const { convertPdfToImages } = require('../utils/pdfUtils');

const uploadPdf = async (req, res) => {
    const pdfPath = req.file.path;
    const outputDir = path.join(__dirname, '..', 'outputs', 'pdf_images');

    try {
        const imagePaths = await convertPdfToImages(pdfPath, outputDir);
        res.status(200).json({ images: imagePaths });
    } catch (error) {
        res.status(500).json({ error: 'Failed to convert PDF to images' });
    }
};

module.exports = { uploadPdf };
