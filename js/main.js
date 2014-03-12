var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
context.fillStyle = "red";
var width = canvas.width;
var height = canvas.height;

var polygons = [];
for (var i = 0; i < 4; i++) {
  for (var j = 0; j < 4; j++) {
    polygons.push(new RegularPolygon(3+j+i, 50, "red", new Vector(100+200*i, 100+150*j)));
  }
}

var player = new RegularPolygon(3, 50, "green", new Vector (400, 400));

function init() {
  render();
};

var omega = Math.PI/2;
var time = Date.now();
var dt;

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

function update() {
  var now = Date.now();
  dt = (now - time)/1000;
  time = now;
  handleInput(dt);
  player.computeBounds();
  player.colliding = false;
  _.forEach(polygons, function (p) {
    p.rotate(omega*dt); 
    p.computeBounds();
    if (p.collides(player)) {
      player.colliding = true;
    }
  });

};

function draw() {
  context.clearRect(0, 0, width, height);
  _.forEach(polygons, function (p) {p.draw(context); p.drawBounds(context);});
  var col = player.color;
  if (player.colliding)
    player.color = "black";
  player.drawBounds(context);  
  player.color = col;
  player.draw(context);
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
