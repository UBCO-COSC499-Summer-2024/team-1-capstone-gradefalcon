const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const bodyParser = require('body-parser');
const pool = require('./utils/db');
const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');

const classRoutes = require('./routes/classRoutes');
const userRoutes = require('./routes/userRoutes');
const examRoutes = require('./routes/examRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const courseRoutes = require('./routes/courseRoutes');

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

app.use(
  session({
    store: new PgSession({
      pool: pool,
      tableName: "session",
    }),
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
    },
  })
);

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUERURL,
});

const checkRole = (role) => {
  return (req, res, next) => {
    const roles = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/roles`] || [];
    if (roles.includes(role)) {
      next();
    } else {
      res.status(403).json({ message: 'Insufficient role' });
    }
  };
};

const checkPermissions = (permissions) => {
  return requiredScopes(permissions);
};

module.exports = { checkRole, checkJwt, checkPermissions };

app.get('/api/public', (req, res) => {
  res.json({
    message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'
  });
});

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

app.use('/class', checkJwt, checkRole('instructor'), classRoutes);
app.use('/exam', checkJwt, checkRole('instructor'), examRoutes);
app.use('/users', checkJwt, checkRole('admin'), userRoutes);
app.use('/upload', checkJwt, checkRole('uploader'), uploadRoutes);
app.use('/courses', checkJwt, checkRole('instructor'), courseRoutes);

app.get('/healthz', (req, res) => {
  res.send('I am happy and healthy\n');
});

app.get("/session-info", (req, res) => {
  res.json({
    userId: req.session.userId,
    userName: req.session.userName,
  });
});

const PORT = process.env.PORT || 5001; // Change the internal port to 5001
console.log(`Starting server on port ${PORT}`);

app.listen(PORT, function() {
  console.log(`Listening on http://localhost:${PORT}`);
});

module.exports = app;
