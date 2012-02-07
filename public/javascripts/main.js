$(function() {
  var socket = io.connect();
  var $canvas = $('#main');
  var canvas = $canvas[0];
  canvas.height = canvas.offsetHeight;
  canvas.width = canvas.offsetWidth;
  var ctx = canvas.getContext("2d");
  var from = {};

  $canvas.bind({
    'touchstart mousedown': function(e) {
      e.preventDefault();
      from = adjustXY(e.originalEvent, this.started);
      this.started = true;
    },
    'touchmove mousemove': function(e) {
      e.preventDefault();
      if (!this.started) return;
      var to = adjustXY(e.originalEvent, this.started);
      drawLine(from, to, "red");
      socket.emit('draw', {'from': from, 'to': to});
      from = to;
    },
    'touchend mouseup': function(e) {
      e.preventDefault();
      if (!this.started) return;
      this.started = false;
    }
  });

  socket.on('draw', function(data) {
    drawLine(data.from, data.to, "green");
  });

  function drawLine(from, to, color) {
    var startX = from.x;
    var startY = from.y;
    var dx = (to.x - startX) / 20;
    var dy = (to.y - startY) / 20;
    for (var i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(startX, startY, 3, 0, Math.PI * 2, false);
      ctx.fillStyle = color;
      ctx.fill();
      startX += dx;
      startY += dy;
    }
  }
});

function adjustXY(event, started) {
  var touchable = ('ontouchstart' in window);
  var rect = event.target.getBoundingClientRect();
  return {
    x: touchable
      ? started
        ? event.changedTouches[0].clientX - rect.left
        : event.touches[0].clientX - rect.left
      : event.clientX - rect.left,
    y: touchable
      ? started
        ? event.changedTouches[0].clientY - rect.top
        : event.touches[0].clientY - rect.top
      : event.clientY - rect.top
  };
}
