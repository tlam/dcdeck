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
  var superheroes = data.superheroes;
  var source = $("#superhero-template").html();
  var template = Handlebars.compile(source);
  for (i=0; i<superheroes.length; i++) {
    var context = {superhero: superheroes[i]};
    var html = template(context);
    $("div#superhero-output-" + i).html(html);
  }
});

socket.on('starting cards', function(data) {
  console.log(data);
  var starting_cards = data.starting_cards;
  var source = $("#hand-template").html();
  var template = Handlebars.compile(source);
  for (i=0; i<starting_cards.length; i++) {
    var context = {cards: starting_cards[i].slice(0, 5)};
    var html = template(context);
    $("div#hand-output-" + i).html(html);
  }
});

$(document).ready(function() {
  $('button#start').click(function() {
    socket.emit('start game', {});
  });
});
