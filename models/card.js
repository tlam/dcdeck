var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var CardSchema = mongoose.Schema({
    name: String
  , type: String
  , cost: {type: Number, default: 0}
  , vp: String
  , power: {type: Number, default: 0}
  , description: String
  , player: String
  , game_location: String
});

module.exports = mongoose.model('Card', CardSchema);
