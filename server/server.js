var express = require('express');
var partials = require('express-partials');
var mongoose = require('mongoose');
var kue = require('kue'); 
var redis = require('redis');
var http = require('http');

var app = express();
require('../server/config/middleware.js')(app, express);
// mongoose.connect('mongodb://localhost/MyApp');

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

jobs.process('new job', function (job, done){
	console.log('job is processing');
  // carry out all the job function here
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
          console.log('final htmlcontent is: ', data);
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
