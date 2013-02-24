var socket = io.connect();

socket.on('super villains', function(data) {
  console.log(data);
  var source = $("#super-villains-template").html();
  var template = Handlebars.compile(source);
  var context = {villains: data.super_villains};
  var html = template(context);
  $("#super-villains-output").html(html);
});

socket.on('superheroes', function(data) {
  console.log(data);
});

$(document).ready(function() {
  $('button#start').click(function() {
    socket.emit('start game', {});
  });
});
