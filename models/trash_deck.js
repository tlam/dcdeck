var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Card = require('./card.js');
 
var TrashDeckSchema = mongoose.Schema({
    cards: [Card.schema]
});

module.exports = mongoose.model('TrashDeck', TrashDeckSchema);
