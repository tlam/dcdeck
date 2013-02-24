var fs = require('fs')
  , Game = require('../models/game.js')
  , Superhero = require('../models/superhero.js');
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.admin = function(req, res){
  Superhero.find({}, function(err, superheroes) {
    console.log(superheroes);
    var context = {
      superheroes: superheroes,
      title: 'Admin'
    };
    res.render('admin', context);
  });
};

exports.syncdb = function(req, res){
  Superhero.count({}, function(err, count) {
    if (count == 0) {
      var array = fs.readFileSync('models/fixtures/superheroes.csv').toString().split('\n');
      for (i in array) {
        if (array[i] == '') {
          continue;
        }
        var data = array[i].split(',');
        var superhero = new Superhero({
          name: data[0],
          description: data[1]
        });
        superhero.save();
      }
      res.render('syncdb', {title: 'Number of superheroes: ' + array.length});
    }
    else {
      res.render('syncdb', {title: 'Number of superheroes: ' + count});
    }
  });
};
