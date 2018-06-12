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
  tags: [String],
  created: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [{
      type: Number,
      required: 'U must supply coords'
    }],
    address: {
      type: String,
      required: 'U must supply address'
    }
  },
  photo: String
});

storeSchema.pre('save', async function(next) {
  if (!this.isModified('name')){
    return next();
  }
  this.slug = slug(this.name);

  const slugRegExp = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i')
  const storesWithSlugs = await this.constructor.find({slug: slugRegExp});

  if (storesWithSlugs.length) {
    this.slug = `${this.slug}-${storesWithSlugs.length + 1}`;
  }
  next();
})

module.exports = mongoose.model('Store', storeSchema); //setting model with the name of 'Store'
