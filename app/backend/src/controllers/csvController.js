const path = require('path');
const { parseCsvFile } = require('../utils/csvUtils');

const parseCsv = async (req, res) => {
    const csvFilePath = path.join(__dirname, '..', 'outputs', 'output.csv'); // Adjust the path as necessary

    try {
        const data = await parseCsvFile(csvFilePath);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to parse CSV file' });
    }
};

module.exports = { parseCsv };
