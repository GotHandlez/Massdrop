var http = require('http');
var jobs = require('./jobs.js');

module.exports = function () {
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
}