
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose');

var app = express()
  , server = http.createServer(app)
  , io = require('./sockets').listen(server);

if (app.settings.env == 'production') {
  io.configure(function() {
    io.set('transports', ['xhr-polling']);
    io.set('polling duration', 10);
  });
}

var mongo_uri = 
  process.env.MONGODB_URI ||
  process.env.MONGOLAB_URI ||
  'mongodb://localhost/dcdeck';
var mongo_options = {db: {safe: true}};
mongoose.connect(mongo_uri, mongo_options);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


app.get('/', routes.index);
app.get('/admin', routes.admin);
app.post('/load-cards', routes.load_cards);
app.post('/load-players', routes.load_players);
app.post('/load-superheroes', routes.load_superheroes);
app.get('/users', user.list);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

