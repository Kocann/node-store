const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongooose = require('passport-local-mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'please provide valid email address'],
    required: 'Please provide email address'
  },
  name: {
    type: String,
    required: 'Please provide name',
    trim: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date 
});

// generated dynamicaly field
userSchema.virtual('gravatar').get(function(){
  const hash = md5(this.email);
  return `https://gravatar.com/avatar/${hash}?s=200`
})
userSchema.plugin(passportLocalMongooose,  {usernameField: 'email'}); //it takes care of creating password and so on
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);
