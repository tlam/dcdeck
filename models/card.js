var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var Cardchema = mongoose.Schema({
  name: String
});

module.exports = mongoose.model('Card', CardSchema);
