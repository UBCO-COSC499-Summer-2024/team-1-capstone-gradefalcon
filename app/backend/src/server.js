const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const pool = require('./utils/db');
const classRoutes = require('./routes/classRoutes');
const userRoutes = require('./routes/userRoutes');
const { jwtCheck } = require('./middleware/authMiddleware'); // Import the middleware

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

// Enforce JWT validation on all endpoints
app.use(jwtCheck);

// Use your other routes
app.use('/class', classRoutes);
app.use('/users', userRoutes);

app.get('/healthz', (req, res) => {
  res.send('I am happy and healthy\n');
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Starting server on port ${PORT}`);
});

module.exports = app;
