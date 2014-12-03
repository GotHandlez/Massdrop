var cardController = require('./cardController.js');

module.exports = function (app) {
  // app === userRouter injected from middlware.js

  app.post('/add', cardController.addCard);
};
