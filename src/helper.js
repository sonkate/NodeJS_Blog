function requiresLogin(req, res, next) {
    if (req.session.user && req.session.user.profile) {
      next();
    } else {
      res.redirect('/auth/twitter');
    }
  }

module.exports = {
    requiresLogin
}