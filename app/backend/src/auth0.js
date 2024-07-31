const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

const checkPermissions = (requiredPermissions) => {
  return (req, res, next) => {
    const permissions = req.auth?.permissions || [];
    const hasPermissions = requiredPermissions.every(permission => permissions.includes(permission));
    if (!hasPermissions) {
      console.error("auth0 Insufficient permissions:", permissions);
      return res.status(403).json({ message: 'Forbidden', requiredPermissions, userPermissions: permissions });
    }
    next();
  };
};

const errorHandler = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    console.error("JWT Error:", err);
    res.status(401).json({ message: "Invalid token" });
  } else {
    next(err);
  }
};

const checkRole = (role) => {
  return (req, res, next) => {
    const roles = req.auth[`${process.env.REACT_APP_AUTH0_AUDIENCE}/roles`] || [];
    if (!roles.includes(role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

module.exports = { checkJwt, checkPermissions, checkRole, errorHandler };
