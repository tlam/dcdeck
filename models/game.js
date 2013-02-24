var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var GameSchema = mongoose.Schema({
  name: String
});

module.exports = mongoose.model('Game', GameSchema);
