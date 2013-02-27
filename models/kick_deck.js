var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Card = require('./card.js');
 
var KickDeckSchema = mongoose.Schema({
    cards: [Card.schema]
});

module.exports = mongoose.model('KickDeck', KickDeckSchema);
