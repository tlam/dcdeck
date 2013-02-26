var sio = require('socket.io')
  , utils = require('./lib/utils.js')
  , Card = require('./models/card.js')
  , Player = require('./models/player.js')
  , Superhero = require('./models/superhero.js')
  , SuperVillainDeck = require('./models/supervillain_deck.js');


module.exports.listen = function(app) {
  io = sio.listen(app);

  io.sockets.on('connection', function(socket) {
    socket.on('start game', function(data) {
      Card.find({type: 'Super-Villain'}, function(err, super_villains) {
        var ordered_villains = [];
        var rasal_ghul = '';
        for (var i=0; i<super_villains.length; i++) {
          if (super_villains[i].name == "Ra's Al-Ghul") {
            rasal_ghul = super_villains[i];
          }
          else {
            ordered_villains.push(super_villains[i]);
          }
        }
        utils.shuffle(ordered_villains);
        // Insert Ra's Al-Ghul at the beginning of array
        ordered_villains.splice(0, 0, rasal_ghul);
        var supervillain_deck = new SuperVillainDeck();
        ordered_villains.map(function(card) {
          supervillain_deck.cards.push(card);
        });
        supervillain_deck.save(function(err, deck) {
          io.sockets.emit('super villains', {
            super_villains: ordered_villains
          });
        });
      });

      Superhero.find({}, function(err, superheroes) {
        utils.shuffle(superheroes);
        Player.find({}, function(err, players) {
          for (var i=0; i<players.length; i++) {
            players[i].superhero.push(superheroes[i]);
            players[i].save();
          }
          io.sockets.emit('superheroes', {
            superheroes: superheroes
          });
        });
      });

      var num_players = 2;
      var starting_punch = 7;
      var starting_vulnerability = 3;
      var total_punch = num_players * starting_punch;
      var total_vulnerability = num_players * starting_vulnerability;

      Card.find({name: 'Punch'}).limit(total_punch).exec(function(err, punches) {
        Card.find({name: 'Vulnerability'}).limit(total_vulnerability).exec(function(err, vulnerabilities) {

          var starting_cards = [];
          var punch_start_index = 0;
          var punch_end_index = starting_punch;
          var vul_start_index = 0;
          var vul_end_index = starting_vulnerability;

          for (i=0; i<num_players; i++) {
            var player_punch = punches.slice(punch_start_index, punch_end_index);
            var player_vul = vulnerabilities.slice(vul_start_index, vul_end_index);

            var cards = player_punch.concat(player_vul);
            utils.shuffle(cards);
            starting_cards.push(cards);

            punch_start_index = punch_end_index;
            punch_end_index = punch_start_index + starting_punch;
            vul_start_index = vul_end_index;
            vul_end_index = vul_start_index + starting_vulnerability;
          }

          io.sockets.emit('starting cards', {
            starting_cards: starting_cards
          });
        });
      });

      var playing_cards = ['Equipment', 'Hero', 'Location', 'Superpower', 'Villain'];
      Card.find().where('type').in(playing_cards).exec(function(err, cards) {
        utils.shuffle(cards);
        io.sockets.emit('lineup', {
          lineup: cards
        });
      });
    }); // end start game


    socket.on('reset game', function(data) {
      Card.find({}, function(err, cards) {
        cards.map(function(card) {
          card.player = null;
          card.save();
        });
      });

      SuperVillainDeck.remove({}).exec();

      // Only default player 1 as the starting player
      Player.find({}, function(err, players) {
        players.map(function(player) {
          player.superhero = [];
          if (player.name == 'Player 1') {
            player.is_turn = true;
          }
          else {
            player.is_turn = false;
          }
          player.save();
        });
      });
    });
  });

  return io;
};
