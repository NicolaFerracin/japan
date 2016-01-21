// wonder mongoose Schema
var mongoose = require('mongoose');

module.exports = mongoose.model('Wonder', {
  link : String,
  likes : Number,
  likers : [String],
  title : String,
  user : String,

});
