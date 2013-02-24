var fs = require('fs')
  , Game = require('../models/game.js')
  , Card = require('../models/card.js')
  , Superhero = require('../models/superhero.js');
/*
 * GET home page.
 */

exports.index = function(req, res) {
  var context = {
    players: ['Player 1', 'Player 2'],
    title: 'DC Deck'
  };
  res.render('index', context);
};

exports.admin = function(req, res) {
  Superhero.find({}, function(err, superheroes) {
    Card.find({}, function(err, cards) {
      var context = {
        cards: cards,
        superheroes: superheroes,
        title: 'Admin'
      };
      res.render('admin', context);
    });
  });
};

exports.load_superheroes = function(req, res) {
  var template = 'load_superheroes';
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
      res.render(template, {title: 'Number of new superheroes: ' + array.length});
    }
    else {
      res.render(template, {title: 'Number of existing superheroes: ' + count});
    }
  });
};

exports.load_cards = function(req, res) {
  var template = 'load_cards';
  Card.count({}, function(err, count) {
    if (count == 0) {
      var array = fs.readFileSync('models/fixtures/cards.csv').toString().split('\n');
      for (i in array) {
        if (array[i] == '') {
          continue;
        }
        var data = array[i].split(',');
        var card = new Card({
          name: data[0],
          type: data[1],
          cost: data[2],
          vp: data[3],
          power: data[4],
          description: data[5]
        });
        card.save();
      }
      res.render(template, {title: 'Cards loaded: ' + array.length});
    }
    else {
      res.render(template, {title: 'Cards already loaded'});
    }
  });
}
