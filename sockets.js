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
      console.log('Game started');
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
        io.sockets.emit('superheroes', {
          superheroes: superheroes
        });
      });
    });
  });

  return io;
};
