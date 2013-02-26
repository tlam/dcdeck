var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var SuperheroSchema = mongoose.Schema({
    name: String
  , description: String
});


module.exports = mongoose.model('Superhero', SuperheroSchema);
