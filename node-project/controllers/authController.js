const passport = require('passport');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed login',
  successRedirect: '/',
  successFlash: 'Successfylly logged in'
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'U are logout');
  res.redirect('/');
}

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  req.flash('error', 'M8 you have to logg in first')
  res.redirect('/login');
}