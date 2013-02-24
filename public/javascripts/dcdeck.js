var socket = io.connect();

socket.on('super villains', function(data) {
  console.log(data);
});

socket.on('superheroes', function(data) {
  console.log(data);
});

$(document).ready(function() {
  $('button#start').click(function() {
    socket.emit('start game', {});
  });
});
