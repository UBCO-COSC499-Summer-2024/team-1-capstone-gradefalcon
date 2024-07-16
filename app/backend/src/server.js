const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const bodyParser = require('body-parser');
const pool = require('./utils/db');
const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');

// const authRoutes = require('./routes/authRoutes');
const classRoutes = require('./routes/classRoutes');
// const userRoutes = require('./routes/userRoutes');
const examRoutes = require('./routes/examRoutes');

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

// Auth0 configuration
const checkJwt = auth({
  audience: '{yourApiIdentifier}',
  issuerBaseURL: `https://dev-1wzrc3nphnk4w01y.ca.auth0.com/`,
});

const checkScopes = requiredScopes('read:messages');

// Public route
app.get('/api/public', function(req, res) {
  res.json({
    message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'
  });
});

// Private routes
app.get('/api/private', checkJwt, function(req, res) {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated to see this.'
  });
});

app.get('/api/private-scoped', checkJwt, checkScopes, function(req, res) {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'
  });
});

// Your existing routes
// app.use('/auth', authRoutes);
app.use('/class', checkJwt, classRoutes); // Protecting existing routes with Auth0
app.use('/exam', checkJwt, examRoutes);   // Protecting existing routes with Auth0
// app.use('/users', checkJwt, userRoutes); // Uncomment if userRoutes is used

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

app.listen(3000, function() {
  console.log('Listening on http://localhost:3000');
});

module.exports = app;
