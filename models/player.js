var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Card = require('./card.js')
  , Superhero = require('./superhero.js');

var PlayerSchema = mongoose.Schema({
    name: String
  , is_turn: Boolean
  , superhero: [Superhero.schema]
  , hand: [Card.schema]
  , deck: [Card.schema]
  , discard: [Card.schema]
});

module.exports = mongoose.model('Player', PlayerSchema);
