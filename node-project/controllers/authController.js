const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

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

exports.forgot = async (req, res) => {
  const user = await User.findOne({email: req.body.email});
  if (!user) {
    req.flash('error', 'Email was sent on provided email');
    res.redirect('/login');
  }

  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 36000000; //1h from now

  await user.save();

  const resetUrl = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
  req.flash('success', `${resetUrl}`);
  res.redirect('/login');
}

exports.reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {$gt: Date.now()} //is token still valid
  })

  if (!user) {
    req.flash('error', 'token expired');
    return res.redirect('/login')
  }

  res.render('reset', {title: 'Reset your password'})
}

exports.confirmedPasswords = (req, res, next) => {
 if (req.body.password === req.body['password-confirm']) {
   next();
   return;
 }

 req.flash('error', 'password do not match');
 res.redirect('back');
}

exports.update = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {$gt: Date.now()} //is token still valid
  })

  if (!user) {
    req.flash('error', 'token expired');
    return res.redirect('/login')
  }

  // from passport I guess
  const setPassword = promisify(user.setPassword, user)
  await setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updateUser = await user.save();
  //from passport
  await req.login(updateUser);
  req.flash('success', 'pass reseted')
  res.redirect('/')
}