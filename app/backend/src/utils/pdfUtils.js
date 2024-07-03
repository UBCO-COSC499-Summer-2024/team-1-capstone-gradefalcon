const { convert } = require('pdf2image');
const fs = require('fs');
const path = require('path');

async function convertPdfToImages(pdfPath, outputDir) {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const options = {
        density: 300,
        saveFilename: 'page',
        savePath: outputDir,
        format: 'png',
        width: 1200,
        height: 1600
    };

    try {
        const images = await convert(pdfPath, options);
        return images.map(image => image.path);
    } catch (error) {
        console.error('Error converting PDF to images:', error);
        throw error;
    }
}

module.exports = { convertPdfToImages };
