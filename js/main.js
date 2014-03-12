var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
context.fillStyle = "red";
var width = canvas.width;
var height = canvas.height;

var vectors = [new Vector(-50, -50), new Vector(50, -50), new Vector(50, 50), new Vector(-50, 50)];
var center = new Vector(100, 100);
var poly = new Polygon(vectors, center, 0);

var polygons = [];
for (var i = 0; i < 4; i++) {
  for (var j = 0; j < 4; j++) {
    polygons.push(new RegularPolygon(3+j+i, 50, new Vector(100+200*i, 100+150*j), 0));
  }
}

function init() {
  render();
};

var omega = Math.PI/2;
var time = Date.now();
var dt;

function update() {
  var now = Date.now();
  dt = (now - time)/1000;
  time = now;
  _.forEach(polygons, function (p) {p.rotate2(omega*dt); p.computeBounds();});
};

function draw() {
  context.clearRect(0, 0, width, height);
  _.forEach(polygons, function (p) {p.draw(context); p.drawBounds(context);});
};

function render() {
  requestAnimationFrame(render);
  update();
  draw();
};

/**
 * requestAnimationFrame shim by Paul Irish
 */
window.requestAnimationFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000/60);
    };
})();

window.onload = function() {
  init();
};
