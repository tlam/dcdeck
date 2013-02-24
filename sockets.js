var Card = require('./models/card.js');
var Superhero = require('./models/superhero.js');
var sio = require('socket.io');

module.exports.listen = function(app) {
  io = sio.listen(app);

  io.sockets.on('connection', function(socket) {
    socket.on('start game', function(data) {
      console.log('Game started');
      Card.find({type: 'Super-Villain'}, function(err, super_villains) {
        io.sockets.emit('super villains', {
          super_villains: super_villains
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
