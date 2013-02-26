var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var SuperheroSchema = mongoose.Schema({
    name: String
  , description: String
  , player: {type: Schema.ObjectId, ref: 'Player'}
});

module.exports = mongoose.model('Superhero', SuperheroSchema);
