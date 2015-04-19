var express = require('express');
var partials = require('express-partials');
var mongoose = require('mongoose');
var kue = require('kue'); 
var app = express();

mongoose.connect('mongodb://localhost/MyApp');
require('../server/config/middleware.js')(app, express);
require('../server/helpers/consumer.js')();

app.use(kue.app);
console.log('Your app is listening on 9000');
app.listen(9000);
