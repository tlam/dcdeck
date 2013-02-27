var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Card = require('./card.js');
 
var LineupSchema = mongoose.Schema({
    cards: [Card.schema]
});

module.exports = mongoose.model('Lineup', LineupSchema);
