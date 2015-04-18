var morgan      = require('morgan'), // used for logging incoming request
    bodyParser  = require('body-parser');

module.exports = function (app, express) {
  var linkRouter = express.Router();

  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));

  app.use('/api/links', linkRouter);
  require('../link/linkRoutes.js')(linkRouter);
};
