var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LinkSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },

  jobId: {
    type: String,
    required: true,
    unique: true
  },

  content: {
    type:String,
    required:true
  }
});

module.exports = mongoose.model('Link', LinkSchema);
