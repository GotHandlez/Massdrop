var kue = require('kue');
var redis = require('redis');

module.exports = function() { 
		return kue.createQueue({
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
}();
