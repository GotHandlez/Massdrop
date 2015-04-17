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

// var hashingFunction = function(str) {
//   var jobId = 0;
//   for(var i = 0; i < str.length; i++) {
//     jobId += (str.charCodeAt(i)-65) * 2;
//   }

//   return jobId;
// }

module.exports = {
  getLink: function (req, res) {
    var jobId = req.query.jobId;

    //check if content is in the database
    Links.findOne({jobId: jobId}, function(err, link) {
      if(link) {
        //if yes, send content
        res.send(link.content);
      } else {
        //if not, check queue to find status
        kue.Job.get(jobId, function(error, job) {
          if(job) {
            job
              .on('failed', function (){
                res.send('Job', jobId, 'with name', job.data.name, 'has failed');
              })
              .on('progress', function(progress, data){
                res.send('\r  job #' + jobId + ' ' + progress + '% complete with data ', data);
              })
              .on('complete', function (){
                res.send('Job', jobId, 'with name', job.data.name, 'is done');
              });
          }
          else {
            if(error) {
              res.send(error);
            }
            else {
              res.send("job id does not exist!");
            }
          }
        });
      }
    });
     
  },

  postLink: function (req, res) {
    var link = req.body.data.replace('http://','').replace('https://','')/*.replace('www.','')*/;
    kue.redis.createClient().get(link, function(err, jobId) {
      //check if link has been added already to the queue
      if(jobId) {
        //check if link has been added already to the queue
        kue.Job.get(jobId, function (err, job) {
          if(job) {
            console.log("link has already been posted!");
            res.send(jobId);
          } else {
              //add link to job queue for future processing
              var job = jobs.create('new job', {
                  name: link
              }).priority('high').attempts(5);
              
              //e.g. 'www.google.com' -> 4
              //if 'www.google.com' is POST'ed again, I could look up job id
              kue.redis.createClient().set(link, job.id);

              job
                .on('complete', function (htmlContent){
                  kue.redis.createClient().del(link, function(err, deleted){
                    console.log(link + " entry deleted!");
                  });

                  //save html content in database
                  Links.findOne({jobId: job.id}, function(err, link) {
                    if(!link) {
                      new Links({name: job.data.name, jobId: job.id, content: htmlContent}).save(function(e) {
                        //remove job from queue once completed
                        job.remove(function(err){
                          if (err) throw err;
                          console.log('removed completed job #%d', job.id);
                        });

                        //return job id to client
                        res.send(job.id);
                      });
                    }
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
                    //return job id
                    res.send(job.id);
                  }
                });
            }
          });
      }
    });
  }
};
