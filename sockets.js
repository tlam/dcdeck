var Card = require('./models/card.js');
var Superhero = require('./models/superhero.js');
var sio = require('socket.io');


function shuffle(cards) {
  var len = cards.length;
  var i = len;
  while (i--) {
    var p = parseInt(Math.random()*len);
    var t = cards[i];
    cards[i] = cards[p];
    cards[p] = t;
  }
}


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
        shuffle(ordered_villains);
        // Insert Ra's Al-Ghul at the beginning of array
        ordered_villains.splice(0, 0, rasal_ghul);
        io.sockets.emit('super villains', {
          super_villains: ordered_villains
        });
      });

      Superhero.find({}, function(err, superheroes) {
        shuffle(superheroes);
        io.sockets.emit('superheroes', {
          superheroes: superheroes
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
            shuffle(cards);
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
        shuffle(cards);
        io.sockets.emit('lineup', {
          lineup: cards
        });
      });
    }); // end start game
  });

  return io;
};
