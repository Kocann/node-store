exports.myMiddleware = (req, res, next) => {
  req.name = 'wes';
  next();
}

exports.homePage = (req, res) => {
  res.render('index') //rendering from layouts, index is the name of pug file
}