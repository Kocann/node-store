const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
  name: {
    type: String, 
    trim: true,
    required: 'Please provide a name'
  },
  slug: String,
  description: {
    type: String, 
    trim: true
  },
  tags: [String]
});

storeSchema.pre('save', function(next) {
  if (!this.isModified('name')){
    return next();
  }
  this.slug = slug(this.name);
  next();
})

module.exports = mongoose.model('Store', storeSchema); //setting model with the name of 'Store'
