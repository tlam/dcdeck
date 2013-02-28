var socket = io.connect();

socket.on('super villains', function(data) {
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

socket.on('buy msg', function(data) {
  $('span.lineup-msg').text(data.msg);
});

$(document).ready(function() {
  $('button#start').click(function() {
    socket.emit('reset game', {});
    socket.emit('start game', {});
  });

  $('body').on('click', 'input[type=button].super-villain', function() {
    var card = $(this).attr('card');
    socket.emit('defeat super villain', {
      card: card
    });
  });

  $('body').on('click', 'input[type=button].end-turn', function() {
    socket.emit('end turn', {
    });
  });

  $('body').on('click', 'input[type=button].buy', function() {
    var card = $(this).attr('card');
    socket.emit('buy card', {
      card: card
    });
  });
});
