// wonder mongoose Schema
var mongoose = require('mongoose');

module.exports = mongoose.model('Wonder', {
  link : String,
  likes : Number,
  title : String,
  user : String,
  
});
