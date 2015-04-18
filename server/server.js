var express = require('express');
var partials = require('express-partials');
var mongoose = require('mongoose');
var kue = require('kue'); 
var redis = require('redis');
var http = require('http');

var app = express();
mongoose.connect('mongodb://localhost/MyApp');
require('../server/config/middleware.js')(app, express);

var jobs = kue.createQueue({
	prefix: 'q',
  redis: {
    port: 6379,
    host: '127.0.0.1',
    auth: '',
    options: {
    }
  },
  disableSearch: true	
});

jobs.process('new job', 20, function (job, done){
	console.log('job ' + job.id + ' is processing');

  // fetching html of web page
  var options = {
      host: job.data.name,
      path: '/'
  }

  var data = '';
  var request = http.request(options, function (res) {
      res.on('data', function (chunk) {
          data += chunk;
      });
      res.on('end', function () {
          //data is htmlContent
          //this will call job.on('complete', fn) in producer thread
          done && done(null, data.toString());
      });
  });

  request.on('error', function (e) {
      console.log(e.message);
  });

  request.end();
});

app.use(kue.app);
console.log('Your app is listening on 9000');
app.listen(9000);
