var linkController = require('./linkController.js');

module.exports = function (app) {
  app.get('/', linkController.getLink);
  app.post('/', linkController.postLink);
};
