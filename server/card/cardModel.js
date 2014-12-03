var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('../users/userModel.js');

var CardSchema = new mongoose.Schema({
  points: {
    type: Number,
    required: true,
    unique: true
  },

  card: {
    type: String,
    required: true,
  },

  user: [{type: Schema.Types.ObjectId, ref: 'user'}]
  
});


module.exports = mongoose.model('card', CardSchema);
