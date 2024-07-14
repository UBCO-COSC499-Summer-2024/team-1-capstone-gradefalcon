const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const pool = require('./utils/db');
const classRoutes = require('./routes/classRoutes');
const userRoutes = require('./routes/userRoutes');
const { jwtCheck } = require('./middleware/authMiddleware'); // Import the middleware
const examRoutes = require('./routes/examRoutes');

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

// Enforce JWT validation on all endpoints
app.use(jwtCheck);

// Use your other routes
app.use('/class', classRoutes);
app.use('/exam', examRoutes);
app.use('/users', userRoutes);

app.get('/healthz', (req, res) => {
  res.send('I am happy and healthy\n');
});

// Session info route
app.get("/session-info", (req, res) => {
  res.json({
    userId: req.session.userId,
    userName: req.session.userName,
  });
});


const PORT = process.env.PORT || 80;
console.log(`Starting server on port ${PORT}`);

module.exports = app;
