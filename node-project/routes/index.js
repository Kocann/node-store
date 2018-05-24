const express = require('express');
const router = express.Router();
const storeController = require('./../controllers/storeController');
const { catchErrors } = require('./../handlers/errorHandlers');

// Do work here
// router.get('/', (req, res) => {
//   const ann = {name: 'ann', age: 1000}
//   // res.send('Hey! It works!');
//   // res.json(ann)
//   res.render('hello', {
//     name: 'ann',
//     dogName: req.query.dog,
//     title: 'ILFOOD'
//   }); //first parameter is name of the template without extension. It must live inside whatever location is declared in app.js
// });
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/add', storeController.addStore);
router.post('/add', catchErrors(storeController.createStore));

module.exports = router;
