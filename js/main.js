var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
context.fillStyle = "red";
var width = canvas.width;
var height = canvas.height;

var polygons = [];
for (var i = 0; i < 4; i++) {
  for (var j = 0; j < 4; j++) {
    polygons.push(new RegularPolygon(3+j+i, 50, "red", new Vector(100+200*j, 100+150*i)));
  }
}

var player = new RegularPolygon(3, 50, "green", new Vector (400, 400));

function init() {
  render();
};

var omega = Math.PI/2;
var time = Date.now();
var dt;

var colHandler = new CollisionHandler();

function handleInput (dt) {
  var dir = new Vector(0,0);

  if (keys["left"]) {
    dir.x -= 1;
  }
  if (keys["up"]) {
    dir.y -= 1;
  }
  if (keys["down"]) {
    dir.y += 1;
  }  
  if (keys["right"]) {
    dir.x += 1;
  }

  if (keys["a"]) {
    player.rotate(-1*omega*dt);
  }
  if (keys["d"]) {
    player.rotate(omega*dt);
  }  

  player.translate(dir);
};

var s = -0.4;
var flip = true;
var k = 1;
function update() {
  var now = Date.now();
  dt = (now - time)/1000;
  time = now;
  s += dt;
  if (s >= 0.4) {
    s = -0.4;
    flip = !flip;
  }
  if (flip)
    k = 1/(1+0.1*s);
  else {
    k = 1+0.1*s;
  }
  handleInput(dt);
  player.computeBounds();
  player.computeEdges();
  player.computeNormals();
  player.colliding = false;
  _.forEach(polygons, function (p, i) {
    if ((i + ~~(i / 4)) % 2 == 0)
      p.rotate(omega*dt);
    else
      p.transform(k, 0, 0, 1/k);
    
    p.computeBounds();
    p.computeEdges();
    p.computeNormals();
    if (colHandler.collides(player, p)) {
      player.colliding = true;
    }
  });
};

function draw() {
  context.clearRect(0, 0, width, height);
  _.forEach(polygons, function (p) {p.draw(context); p.drawBounds(context);});
  var col = player.color;
  player.drawBounds(context);  
  if (player.colliding)
    player.color = "black";
  player.draw(context);
  player.color = col;
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
