var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Card = require('./card.js');
 
var DCDeckSchema = mongoose.Schema({
    cards: [Card.schema]
});

module.exports = mongoose.model('DCDeck', DCDeckSchema);
