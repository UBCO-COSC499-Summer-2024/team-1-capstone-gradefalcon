const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const pool = require('./utils/db');

const authRoutes = require('./routes/authRoutes');
const classRoutes = require('./routes/classRoutes');
const userRoutes = require('./routes/userRoutes');
const examRoutes = require('./routes/examRoutes');

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());


app.use('/auth', authRoutes);
app.use('/class', classRoutes);
app.use('/exam', examRoutes);
app.use('/users', userRoutes);

// Apply the authMiddleware to protect the /api/products endpoint
app.get('/api/exam/saveQuestions', authMiddleware, (req, res) => {
  res.json({ message: 'Protected endpoint', user: req.user });
});
// app.get('/api/products', authMiddleware('https://yourdomain.com/api/products'), (req, res) => {
//   res.json({ message: 'Protected products endpoint', user: req.user });
// });

// app.get('/api/orders', authMiddleware('https://yourdomain.com/api/orders'), (req, res) => {
//   res.json({ message: 'Protected orders endpoint', user: req.user });
// });

// app.get('/api/users', authMiddleware('https://yourdomain.com/api/users'), (req, res) => {
//   res.json({ message: 'Protected users endpoint', user: req.user });
// });

app.get('/healthz', (req, res) => {
  res.send('I am happy and healthy\n');
});


const PORT = process.env.PORT || 80;
console.log(`Starting server on port ${PORT}`);

module.exports = app;
