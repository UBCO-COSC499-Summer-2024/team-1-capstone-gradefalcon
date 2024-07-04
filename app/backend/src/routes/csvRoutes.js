const express = require('express');
const { parseCsv } = require('../controllers/csvController');

const router = express.Router();

router.get('/parse-csv', parseCsv);

module.exports = router;
