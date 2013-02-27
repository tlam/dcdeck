var fs = require('fs')
  , Game = require('../models/game.js')
  , Card = require('../models/card.js')
  , Player = require('../models/player.js')
  , Superhero = require('../models/superhero.js')
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
          description: data[5].replace(/;/g, ',').replace("'", '')
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

exports.load_players = function(req, res) {
  var template = 'load_players';
  Player.count({}, function(err, count) {
    if (count == 0) {
      // Default to the creation of 2 players
      for (var i=0; i<2; i++) {
        var num = i + 1;
        var player = new Player({
          name: 'Player ' + num,
          is_turn: false
        });
        player.save()
      }
      res.render(template, {title: '2 Players loaded'});
    }
    else {
      res.render(template, {title: 'Players already loaded'});
    }
  });
}
