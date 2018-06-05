const mongoose = require('mongoose');
const Store = mongoose.model('Store'); //getting model which is called 'Store'
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({message: 'that file type is not allowed'}, false);
    }
  }
};

exports.upload = multer(multerOptions).single('photo')

exports.resize = async (req, res, next) => {
  if (!req.file) { next(); return; }

  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;

  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);

  next();
}

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
const store = await (new Store(req.body)).save();
req.flash('success', `Successfully saved store ${store.name}, would you like to leave a review`)
res.redirect(`/store/${store.slug}`);
}

exports.getStores = async (req, res) => {
  let stores = await Store.find(); 
  res.render('displayStores', {title: 'Store list', stores});
}

exports.editStore = async (req, res) => {
  let storeId = req.params.id;

  let store = await Store.findOne({_id: storeId});
  res.render('editStore', {title: `Edit store ${store.name}`, store});
}

exports.updateStore = async(req, res) => {
  req.body.location.type = 'Point';

  let storeId = req.params.id;
  let store = await Store.findOneAndUpdate(
    {_id: storeId},
    req.body,
    {new: true,
    runValidators: true}
  ).exec();

  req.flash('success', `Store ${store.name} is updated`);
  res.redirect(`/stores/${store._id}/edit`)
}

exports.getStoreBySlug = async (req, res) => {
  const store = await Store.findOne({slug: req.params.slug});
  if (!store) {return next();}
  res.render('store', {store, title: store.name})
}