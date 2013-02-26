var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Card = require('./card.js');

var SuperVillainDeckSchema = mongoose.Schema({
    cards: [Card.schema]
});

module.exports = mongoose.model('SuperVillainDeck', SuperVillainDeckSchema);
