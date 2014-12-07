var express = require('express');
var partials = require('express-partials');
var session = require('express-session');
var mongoose = require('mongoose');

var app = express();

mongoose.connect('mongodb://localhost/Points');
require('../server/config/middleware.js')(app, express);

app.set('view engine', 'html');
app.use(partials());
// app.use(express.static(__dirname + '/public'));


app.use(session({
  secret: 'shhh, it\'s a secret',
  resave: false,
  saveUninitialized: true
}));

console.log('Your app is listening on 8080');
app.listen(8080);
