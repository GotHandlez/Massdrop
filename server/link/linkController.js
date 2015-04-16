var Links = require('./linkModel.js');
var kue = require('kue');

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

var hashingFunction = function(str) {
  var jobId = 0;
  for(var i = 0; i < str.length; i++) {
    jobId += (str.charCodeAt(i)-65) * 2;
  }

  return jobId.toString();
}

module.exports = {
  getLink: function (req, res) {
    var jobId = req.query.jobId;
    kue.redis.createClient().get(jobId, function (err, reply) {
      if(err) {
        //if not done, send back processing status
        //or if specific link does not exist
        
        // Links.findOne({jobId: job.id}, function(err, link) {
        //   if(link) {
        //     res.send(link)
        //   } else {
        //     res.send(err);
        //   }
        // });
      } else {
      //check if jobId is done processing
        //if done, send back html
        res.send(reply.toString());
      }
    });
    
  },

  postLink: function (req, res) {
    var link = req.body.data;
    var jobId = hashingFunction(link);

    //check if link has been added already
    kue.redis.createClient().exists(jobId, function(err, reply) {
      //if so, then return jobId associated with link
      if (reply) {
          res.send(jobId);
      } else {
        //add link to job queue for future processing
        var job = jobs.create('new job', {
            name: link,
            id: jobId
        }).priority('high').attempts(5);

        job
          .on('complete', function (htmlContent){
            //save html content in cache
            kue.redis.createClient().set(jobId, htmlContent);

            //save html content in database
            // Links.findOne({name: job.data.name}, function(err, link) {
            //   if(!link) {
            //     new Links({name: job.data.name, jobId: job.id, content: htmlContent}).save(function(e) {
            //       res.send(htmlContent);
            //     });
            //   }
            // });

            job.remove(function(err){
              if (err) throw err;
              console.log('removed completed job #%d', job.id);
            });

            console.log('Job', job.id, 'with name', job.data.name, 'is done');
          })
          .on('failed', function (){
            console.log('Job', job.id, 'with name', job.data.name, 'has failed');
          })
          .on('progress', function(progress, data){
            console.log('\r  job #' + job.id + ' ' + progress + '% complete with data ', data );

          })
          .save(function(err){
            if(!err) {
              console.log('*******', job.data.id, job.data.name);

              //return jobId
              res.send(job.data.id);
            }
          });
      }
    });
  }
};
