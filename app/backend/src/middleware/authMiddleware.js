const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: "You need to log in" });
  }
};

module.exports = isAuthenticated;
