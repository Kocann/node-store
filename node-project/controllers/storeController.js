const mongoose = require('mongoose');
const Store = mongoose.model('Store'); //getting model which is called 'Store'

exports.homePage = (req, res) => {
  res.render('index') //rendering from layouts, index is the name of pug file
}

exports.addStore = (req, res) => {
  res.render('editStore', {
    title: 'Add Store'
  })
}

exports.createStore = async (req, res) => {

// To catch errors from await
//  try {
//   const store = new Store(req.body);
//   await store.save();
//  } catch (err) { }

// or pack it in some other function which will catch errors
// like it is now done in routes/index.js
const store = new Store(req.body);
await store.save();
res.redirect('/');
}