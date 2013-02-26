var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var PlayerSchema = mongoose.Schema({
    name: String
  , is_turn: Boolean
});

module.exports = mongoose.model('Player', PlayerSchema);
