var socket = io.connect();

socket.on('super villains', function(data) {
  console.log(data);
  var source = $("#super-villains-template").html();
  var template = Handlebars.compile(source);
  var context = {villain: data.super_villain};
  var html = template(context);
  $("#super-villains-output").html(html);
});

socket.on('lineup', function(data) {
  var lineup = data.lineup;
  var source = $("#lineup-template").html();
  var template = Handlebars.compile(source);
  var context = {cards: lineup.slice(0, 5)};
  var html = template(context);
  $("div#lineup-output").html(html);
});

socket.on('players', function(data) {
  var players = data.players;
  console.log(players);
  var source = $("#players-template").html();
  var template = Handlebars.compile(source);
  var context = {players: players};
  var html = template(context);
  $("div#players-output").html(html);
});

$(document).ready(function() {
  $('button#start').click(function() {
    socket.emit('reset game', {});
    socket.emit('start game', {});
  });
});
