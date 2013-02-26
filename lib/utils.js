exports.shuffle = function(cards) {
  var len = cards.length;
  var i = len;
  while (i--) {
    var p = parseInt(Math.random()*len);
    var t = cards[i];
    cards[i] = cards[p];
    cards[p] = t;
  }
};

