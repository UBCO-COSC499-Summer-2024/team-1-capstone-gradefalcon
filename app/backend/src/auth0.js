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
    const roles = req.auth[`${process.env.REACT_APP_AUTH0_MYAPP}/role`] || [];
    if (!roles.includes(role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

const getAuth0ManagementToken = async (req, res) => {
  try {
    const response = await axios.post(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/oauth/token`, {
      client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
      client_secret: process.env.REACT_APP_AUTH0_CLIENT_SECRET,
      audience: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/`,
      grant_type: 'client_credentials'
    });

    res.status(200).json({ access_token: response.data.access_token });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate Auth0 Management token', error: error.message });
  }
};

module.exports = { checkJwt, checkPermissions, checkRole, errorHandler, getAuth0ManagementToken };
