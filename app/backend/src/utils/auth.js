const { IncomingHttpHeaders } = require('http');

const extractBearerTokenFromHeaders = ({ authorization }) => {
  if (!authorization) {
    throw new Error('Authorization header is missing');
  }

  if (!authorization.startsWith('Bearer')) {
    throw new Error('Authorization header is not in the Bearer scheme');
  }

  return authorization.slice(7); // The length of 'Bearer ' is 7
};

module.exports = { extractBearerTokenFromHeaders };
