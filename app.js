var connect = require('connect');
var server = connect.createServer(
  connect.static(__dirname + '/public')
);
var io = require('socket.io').listen(server);

var count = 0;
var log = [];
var snakes = [];
io.sockets.on('connection', function(socket) {
  count++;
  socket.emit('count', {count: count});
  socket.broadcast.emit('count', {count: count});
  log.forEach(function(element, index, array) {
    socket.emit('draw', element);
  });

  socket.on('draw', function(data) {
    if (log.length >= 100) log.shift();
    log.push(data);
    socket.broadcast.emit('draw', data);
  });

  socket.on('addSnake', function(data) {
    data.id = socket.id;
    socket.broadcast.emit('addSnake', data);
  });
  socket.on('move', function(data) {
    data.id = socket.id;
    socket.broadcast.emit('move', data);
  });

  socket.on('disconnection', function() {
    count--;
    socket.broadcast.emit('count', {count: count});
  });

  socket.on('error', function(err) {
    console.log(err.toString());
  });
}).on('error', function(err) {
  console.log(err.toString());
});

server.listen(process.env.NODE_ENV === 'production' ? 80 : 3100);