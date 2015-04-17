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

  return jobId;
}

module.exports = {
  getLink: function (req, res) {
    var jobId = req.query.jobId;
    console.log('getLink has jobId of ', jobId);
    kue.redis.createClient().get(jobId, function (err, reply) {
      if(!reply) {
        //if not done, send back processing status
        //or if specific link does not exist
        var that = err;
        Links.findOne({jobId: jobId}, function(err, link) {
          if(link) {
            res.send(link.content);
          } else {
            res.send(that);
          }
        });
      } else {
      //check if jobId is done processing
        //if done, send back html
        res.send(reply);
      }
    }); 
  },

  postLink: function (req, res) {
    var link = req.body.data.replace('http://','').replace('https://','').replace('www.','');
    var jobId = hashingFunction(link);

    //check if link has been added already to the queue
    jobs.activeCount(function(err,count){
      if(!err) {
        kue.Job.rangeByState('active', 0, count, 'asc', function(err, totalJobs) {
          if(err) {
            res.send(err);
          }

          for(var i = 0; i < totalJobs.length; i++) {
            if(totalJobs[i].data.id === jobId) {
              //if so, then return jobId associated with link
              res.send(jobId);
            }
          }
          //add link to job queue for future processing
          var job = jobs.create('new job', {
              name: link,
              id: jobId
          }).priority('high').attempts(5);
          // job.id = jobId;

          job
            .on('complete', function (htmlContent){
              //save html content in cache
              kue.redis.createClient().set(jobId, htmlContent);

              
              //save html content in database
              Links.findOne({jobId: jobId}, function(err, link) {
                if(!link) {
                  new Links({name: job.data.name, jobId: jobId, content: htmlContent}).save(function(e) {
                    job.remove(function(err){
                      if (err) throw err;
                      console.log('removed completed job #%d', jobId);
                    });

                    res.send(jobId);
                  });
                }
              });


              console.log('Job', jobId, 'with name', job.data.name, 'is done');
            })
            .on('failed', function (){
              console.log('Job', jobId, 'with name', job.data.name, 'has failed');
            })
            .on('progress', function(progress, data){
              console.log('\r  job #' + jobId + ' ' + progress + '% complete with data ', data );

            })
            .save(function(err){
              if(!err) {
                console.log('*******', jobId, job.data.name);

                //return jobId
                res.send(jobId);
              }
            });
          
        });
      }
    });
  }
};
