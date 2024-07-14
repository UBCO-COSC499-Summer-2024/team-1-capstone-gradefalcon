const { auth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'JustALongAssTestStringDontJudge',
  baseURL: 'http://localhost:3000',
  clientID: 'ehuxZCym0ESyQR7ABKTDCGZpM896F4Bv',
  issuerBaseURL: 'https://dev-yqcwuih0t2m7u447.us.auth0.com'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});
