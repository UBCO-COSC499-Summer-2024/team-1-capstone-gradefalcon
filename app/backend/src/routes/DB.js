const express = require('express');
const { checkJwt, checkPermissions } = require('../auth');
const db = require('../db');

const router = express.Router();

router.get('/read', checkJwt, checkPermissions(['read:database']), async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM your_table');
    res.json(result.rows);
  } catch (error) {
    res.status(500).send('Error reading from the database');
  }
});

router.post('/write', checkJwt, checkPermissions(['write:database']), async (req, res) => {
  try {
    const { column1, column2 } = req.body;
    const result = await db.query('INSERT INTO your_table (column1, column2) VALUES ($1, $2) RETURNING *', [column1, column2]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).send('Error writing to the database');
  }
});

module.exports = router;
