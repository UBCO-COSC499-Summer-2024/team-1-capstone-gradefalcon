const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const bodyParser = require('body-parser');
const pool = require('./utils/db');

const authRoutes = require('./routes/authRoutes');
const classRoutes = require('./routes/classRoutes');
const userRoutes = require('./routes/userRoutes');
const examRoutes = require('./routes/examRoutes');
const courseRoutes = require('./routes/courseRoutes'); // Add this line

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

// Set up session middleware
app.use(
  session({
    store: new PgSession({
      pool: pool, // Connection pool
      tableName: "session", // Use another table-name if you want to override default
    }),
    secret: "secret", // Change this to a secure secret key
    resave: false, // This is true by default. It is recommended to set it to false
    saveUninitialized: false, // This is true by default. It is recommended to set it to false
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true, // Ensures the cookie is sent only over HTTP(S), not accessible to client JavaScript
      secure: false, // Set to true if using https
    },
  })
);

app.use('/auth', authRoutes);
app.use('/class', classRoutes);
app.use('/exam', examRoutes);
app.use('/users', userRoutes);
app.use('/courses', courseRoutes); // Add this line

app.get('/healthz', (req, res) => {
  res.send('I am happy and healthy\n');
});

app.get("/session-info", (req, res) => {
  res.json({
    userId: req.session.userId,
    userName: req.session.userName,
  });
});

const PORT = process.env.PORT || 80;
console.log(`Starting server on port ${PORT}`);

module.exports = app;
