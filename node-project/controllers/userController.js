const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.loginForm = (req, res) => {
  res.render('login',  {title: 'Login'})
}

exports.registerForm = (req, res) => {
  res.render('register',  {title: 'Register'})
}

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'You must supply a name').notEmpty();
  req.checkBody('email', 'You must supply a email').notEmpty();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'You must supply a password').notEmpty();
  req.checkBody('password-confirm', 'You must supply a password').notEmpty();
  req.checkBody('password-confirm', 'Your passwords must match').equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('register', {title: 'Register', body: req.body, flashes: req.flash()});
    return;
  }
  next();
};

exports.register = async (req, res, next) => {
  const user = new User({email: req.body.email, name: req.body.name});
  // User.register(user, req.body.password, function(err, user) { //that's from passport - register method added to model
  // });
  const register = promisify(User.register, User); // methid and where it lives
  await register(user, req.body.password); //it doesnt store user pass but hashed versions --> passport thing!
  next();
}