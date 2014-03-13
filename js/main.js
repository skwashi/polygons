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

//var player = new RegularPolygon(3, 50, "green", new Vector (400, 400));
var t = new RegularPolygon(3, 30, "rgba(0,100,100,0.8)",
                           new Vector(0, -40), -Math.PI/2);
var c = new Circle(new Vector(0, 0), 20, "rgba(255,100,0,0.8");
var r = new Rectangle(-15, -15+40, 30, 30, "rgba(0,0,200,0.8");
var player = new Union([t, c, r], new Vector(400, 300));

function init() {
  render();
};

var omega = Math.PI/4;
var plomega = Math.PI/2;
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
    player.rotate(-1*plomega*dt);
  }
  if (keys["d"]) {
    player.rotate(plomega*dt);
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
    k = 1/(1+0.05*s);
  else {
    k = 1+0.05*s;
  }
  handleInput(dt);

  player.setColliding(false);
  _.forEach(polygons, function (p, i) {
    p.setColliding(false);
    
    if ((i + ~~(i / 4)) % 2 == 0)
      p.rotate(omega*dt);
    else
      p.transform(k, 0, 0, 1/k);
    
    if (colHandler.collides(player, p)) {
      p.setColliding(true);
    }
  });
};

function draw() {
  _.forEach(polygons, function (p) {p.drawBounds(context); p.draw(context);});
  player.drawBounds(context);  
  player.draw(context);
};

function render() {
  requestAnimationFrame(render);
  context.clearRect(0, 0, width, height);
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
