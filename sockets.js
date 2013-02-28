var sio = require('socket.io')
  , utils = require('./lib/utils.js')
  , Card = require('./models/card.js')
  , DCDeck = require('./models/dc_deck.js')
  , Lineup = require('./models/lineup.js')
  , Player = require('./models/player.js')
  , Superhero = require('./models/superhero.js')
  , SuperVillainDeck = require('./models/supervillain_deck.js')
  , TrashDeck = require('./models/trash_deck.js');


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
            super_villain: supervillain_deck.cards[0]
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

          Superhero.find({}, function(err, superheroes) {
            utils.shuffle(superheroes);
            Player.find().sort('name').exec(function(err, players) {
              var starting_players = [];
              for (var i=0; i<players.length; i++) {
                player = players[i];
                player.superhero.push(superheroes[i]);
                starting_cards[i].map(function(card, index) {
                  if (index < 5) {
                    player.hand.push(card);
                  }
                  else {
                    player.deck.push(card);
                  }
                });
                player.save();
                starting_players.push(player);
              }
              io.sockets.emit('players', {
                players: starting_players
              });
            });
          });

        });
      });

      var playing_cards = ['Equipment', 'Hero', 'Location', 'Superpower', 'Villain'];
      Card.find().where('type').in(playing_cards).exec(function(err, cards) {
        utils.shuffle(cards);
        var dc_deck = new DCDeck();
        var lineup = new Lineup();

        cards.map(function(card, index) {
          if (index < 5) {
            lineup.cards.push(card);
          }
          else {
            dc_deck.cards.push(card);
          }
        });
        dc_deck.save();
        lineup.save();

        io.sockets.emit('lineup', {
          lineup: lineup.cards
        });
      });
    }); // end start game


    socket.on('reset game', function(data) {
      DCDeck.remove().exec();
      Lineup.remove().exec();
      SuperVillainDeck.remove().exec();
      TrashDeck.remove().exec();

      // Only default player 1 as the starting player
      Player.find({}, function(err, players) {
        players.map(function(player) {
          player.deck = [];
          player.discard = [];
          player.hand = [];
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
    }); // reset game

    socket.on('defeat super villain', function(data) {
      SuperVillainDeck.findOne({}, function(err, super_villains) {
        var card = super_villains.cards.id(data.card).remove();
        Player.findOne({is_turn: true}, function(err, player) {
          player.discard.push(card);
          player.save();
          super_villains.save();
          var super_villain = null;
          if (super_villains.cards.length > 0) {
            super_villain = super_villains.cards[0];
          }
          io.sockets.emit('super villains', {
            super_villain: super_villain
          });
        });
      });
    }); // defeat super villain

  });

  return io;
};
