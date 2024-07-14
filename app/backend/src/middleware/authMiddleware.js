// middleware/authMiddleware.js
const { createRemoteJWKSet, jwtVerify } = require('jose');
const { extractBearerTokenFromHeaders } = require('../utils/auth');


const jwks = createRemoteJWKSet(new URL('https://l3ijbg.logto.app/oidc/jwks'));

const authMiddleware = async (req, res, next) => {
  try {
    const token = extractBearerTokenFromHeaders(req.headers);
    const { payload } = await jwtVerify(
      token,
      jwks,
      {
        issuer: 'https://l3ijbg.logto.app/oidc',
        audience: 'https://localhost3000.com/api/exam/saveQuestions',
      }
    );

    const { scope, sub } = payload;

    // Check for required scope
    // if (!scope.split(' ').includes('read:products')) {
    //   return res.status(403).json({ message: 'Forbidden' });
    // }

    req.user = { id: sub, scope };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = authMiddleware;