var express = require('express');
var partials = require('express-partials');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');
var session = require('express-session');
var mongoose = require('mongoose');

var app = express();

mongoose.connect('mongodb://localhost/Points');
require('../server/config/middleware.js')(app, express);

app.set('view engine', 'html');
app.use(partials());
app.use(bodyParser.json());
// Parse forms (signup/login)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


app.use(session({
  secret: 'shhh, it\'s a secret',
  resave: false,
  saveUninitialized: true
}));


// app.get('*', function(req, res) {
//   res.sendfile('../client/index.html');
// });


console.log('Untitled is listening on 8080');
app.listen(8080);
