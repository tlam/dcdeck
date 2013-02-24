var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var SuperheroSchema = mongoose.Schema({
    name: String
  , description: String
  , player: String
});

module.exports = mongoose.model('Superhero', SuperheroSchema);
