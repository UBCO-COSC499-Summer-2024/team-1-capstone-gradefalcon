const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');

const jwtCheck = auth({
  audience: 'https://gradefalcon.com/api',
  issuerBaseURL: 'https://dev-yqcwuih0t2m7u447.us.auth0.com/',
  tokenSigningAlg: 'RS256'
});

const checkPermissions = (requiredScopes) => {
  return (req, res, next) => {
    const userScopes = req.auth?.scope?.split(' ') || [];

    const hasRequiredScopes = requiredScopes.every(scope => userScopes.includes(scope));

    if (!hasRequiredScopes) {
      return res.status(403).json({ message: 'Forbidden: You do not have the necessary permissions' });
    }

    next();
  };
};

module.exports = { jwtCheck, checkPermissions };
