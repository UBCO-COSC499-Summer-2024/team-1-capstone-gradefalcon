const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const bodyParser = require('body-parser');
const pool = require('./utils/db');
const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');

// const authRoutes = require('./routes/authRoutes');
const classRoutes = require('./routes/classRoutes');
const userRoutes = require('./routes/userRoutes');
const examRoutes = require('./routes/examRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const courseRoutes = require('./routes/courseRoutes');

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
  audience: 'https://Read-Current-User', // Replace with your actual API identifier
  issuerBaseURL: `https://dev-1wzrc3nphnk4w01y.ca.auth0.com/`,
});

// Middleware to check roles
const checkRole = (role) => {
  return (req, res, next) => {
    const roles = req.auth.payload['https://yourdomain.com/roles'] || []; // Use the correct custom namespace
    if (roles.includes(role)) {
      next();
    } else {
      res.status(403).json({ message: 'Insufficient role' });
    }
  };
};

// Exporting checkRole and checkJwt to be used in route files
module.exports = { checkRole, checkJwt };

// Public route
app.get('/api/public', (req, res) => {
  res.json({
    message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'
  });
});

// Private routes with role-based access control
app.get('/api/private', checkJwt, (req, res) => {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated to see this.'
  });
});

app.get('/api/private-scoped', checkJwt, requiredScopes('read:messages'), (req, res) => {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'
  });
});

// Example of a protected route with RBAC
app.use('/class', checkJwt, checkRole('instructor'), classRoutes); // Protecting existing routes with Auth0 and RBAC
app.use('/exam', checkJwt, checkRole('instructor'), examRoutes); // Protecting existing routes with Auth0 and RBAC
app.use('/users', checkJwt, checkRole('admin'), userRoutes); // Protecting existing routes with Auth0 and RBAC
app.use('/upload', checkJwt, checkRole('uploader'), uploadRoutes); // Protecting existing routes with Auth0 and RBAC
app.use('/courses', checkJwt, checkRole('instructor'), courseRoutes); // Protecting existing routes with Auth0 and RBAC

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

app.listen(3000, function() {
  console.log('Listening on http://localhost:3000');
});

module.exports = app;
