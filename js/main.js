var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
context.fillStyle = "red";
var width = canvas.width;
var height = canvas.height;

var polygons = [];
var k = 0;
for (var i = 0; i < 4; i++) {
  for (var j = 0; j < 4; j++) {
    if (i % 2 == 0 && j % 2 == 1 ||
        i % 2 == 1 && j % 2 == 0) {
      polygons.push(new RegularPolygon(3+k, 50, "red", new Vector(100+200*j, 75+150*i)));
      k++;
    }
  }
}

var cb = new Circle(new Vector(400,100), 20, "rgba(255,100,0,0.8");
var ball = new Movable(cb);                           
ball.init(600, 1, 0, 0, 0);
           
var cooldowns = {swim: 0};
var cd = 1;

var power = {max: 0.5, current: 0.5};
var stroke = {active: false, max: 0.75, current: 0};


var borders = [];
borders.push(new Rectangle(0, -95, 800, 100, "rgba(0,0,200,0.5"));
borders.push(new Rectangle(0, 595, 800, 100, "rgba(0,0,200,0.5"));
borders.push(new Rectangle(-95, 0, 100, 600, "rgba(0,0,200,0.5"));
borders.push(new Rectangle(795, 5, 100, 600, "rgba(0,0,200,0.5"));

//var player = new RegularPolygon(3, 50, "green", new Vector (400, 400));

var t2 = new RegularPolygon(3, 30, "rgba(0,100,100,0.8)",
                           new Vector(400, 300), -Math.PI/2);
var c2 = new Circle(new Vector(400, 300), 20, "rgba(0,100,100,0.8");
var r2 = new Rectangle(-15, -15+40, 30, 30, "rgba(0,100,100,0.8");
var t = new RegularPolygon(3, 30, "rgba(0,100,100,0.8)",
                           new Vector(0, -40), -Math.PI/2);
var c = new Circle(new Vector(0, 0), 20, "rgba(255,100,0,0.8");
var r = new Rectangle(-15, -15+40, 30, 30, "rgba(0,0,200,0.8");
var u2 = new Union([t, c, r], new Vector(400, 300));
var player = new Movable(u2);//
player.init(600, 1, Math.PI, 0, 0);

function init() {
  render();
};

var omega = Math.PI/4;
var plomega = Math.PI/2;
var time = Date.now();
var dt;
var gravity = 50;//2000;

var colHandler = new CollisionHandler();

function handleInput (dt) {
//  var dir = new Vector(0,0);

  if (keys["1"]) {
    t2.moveTo(player.pos);
    player.setShape(t2);
  };
  if (keys["2"]) {
    c2.moveTo(player.pos);
    player.setShape(c2);
    ;
  };
  if (keys["3"]) {
    r2.moveTo(player.pos);
    player.setShape(r2);
  };
  if (keys["4"]) {
    u2.moveTo(player.pos);
    player.setShape(u2);
  };

  if (keys["left"]) {
    player.dir.x -= 1;
  }
  if (keys["up"]) {
    if (stroke.active == false) {
      if (stroke.current <= 0) {
        stroke.current += dt;
        player.dir.y -= 1;
        stroke.active = true;
      }
    } else {
      if (stroke.current < stroke.max) {
        stroke.current += dt;
        player.dir.y = -1;
        if (stroke.current >= stroke.max)
          stroke.active = false;
      }
    }
    /*
    if (cooldowns.swim <= 0)
      cooldowns.swim = cd;
    if (cooldowns.swim >= 0.5*cd) 
      player.dir.y -= 1;
     */
  } else
    stroke.active = false;

  if (keys["down"]) {
    player.dir.y += 1;
  }  
  if (keys["right"]) {
    player.dir.x += 1;
  }

  if (keys["a"]) {
    player.shape.rotate(-1*plomega*dt);
  }
  if (keys["d"]) {
    player.shape.rotate(plomega*dt);
  }  

  if (keys["q"]) {
    if (gravity <= 0)
      gravity = 50;
    else
      gravity = 0;
  };

  if (keys["w"])
    push = -push;

  //player.translate(dir);
};

var s = -0.4;
var flip = true;
var push = -1;
var k = 1;
var dir = new Vector(0, 0);
var mtv;
 
function lowerCooldowns(dt) {
  for (var key in cooldowns)
    cooldowns[key] -= dt;
  if (cooldowns[key] <= 0)
    cooldowns[key] = 0;

  if (power.current < power.max)
    power.current += dt/2;
  if (power.current >= power.max)
    power.current = power.max;

  if (stroke.active == false)
    if (stroke.current > 0)
      stroke.current -= dt/1.5;

  if (stroke.current <= 0)
    stroke.current = 0;
}

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
  
  if (time % 40 <= 1)
    ball.dir.init(2*Math.random()-1, 2*Math.random()-1 -gravity/1000);
  ball.move(dt);

  lowerCooldowns(dt);
  player.dir.init(0, 0);
  handleInput(dt);
  player.move(dt);

  ball.shape.setColliding(false);
  player.shape.setColliding(false);
  _.forEach(polygons, function (p, i) {
    p.setColliding(false);
    
    if ((i + ~~(i / 4)) % 2 == 0)
      p.rotate(omega*dt);
    else
      p.transform(k, 0, 0, 1/k);

    _.forEach(polygons, function (q, j) {
      if (i != j) {
        mtv = colHandler.collides(p, q);
        if (mtv != false) {
          p.translate(mtv);
        }
      }
    });

    mtv = colHandler.collides(player.shape, p);
    if (mtv != false) {
      context.beginPath();
      var cx = player.shape.center.x;
      var cy = player.shape.center.y;
      context.moveTo(cx, cy);
      context.lineTo(cx + 100*mtv.x, cy + 100*mtv.y);
      context.closePath();
      context.stroke();
      if (push == 1) {
        mtv.scale(-1);
        p.translate(mtv);
      }
      else {
        mtv.scale(2);
        player.shape.translate(mtv);
        mtv.normalize();
        var v = player.v.project(mtv);
        v.scale(2);
        player.v.dec(v);
      }
    }
    
    mtv = colHandler.collides(ball.shape, p);
    if (mtv != false) {
      ball.shape.translate(mtv);
      mtv.normalize();
      ball.v.dec(ball.v.project(mtv));
    }
  });
  
  _.forEach(borders, function (b) {
    b.setColliding(false);
    mtv = colHandler.collides(player.shape, b);
    if (mtv != false) {
      mtv.scale(2);
      player.shape.translate(mtv);
      mtv.normalize();
      var v = player.v.project(mtv);
      v.scale(2);
      player.v.dec(v);
    }
    mtv = colHandler.collides(ball.shape, b);
    if (mtv != false) {
      ball.shape.translate(mtv);
      mtv.normalize();
      ball.v.dec(ball.v.project(mtv));
    }
  });

  mtv = colHandler.collides(player.shape, ball.shape);
  if (mtv != false) {
    mtv.scale(-1);
    ball.shape.translate(mtv);
  }

};

function draw() {
  _.forEach(borders, function (b) {b.draw(context);});
  context.fillStyle = "rgba(0, 100, 255, 0.2)";
  context.fillRect(0, 0, width, height);
  _.forEach(polygons, function (p) {p.drawBounds(context); p.draw(context);});
  ball.draw(context);
  player.draw(context);
  context.fillStyle = "rgba(0, 100, 255, 0.05)";
  context.fillRect(0, 0, width, height);

  context.fillStyle = stroke.active || stroke.current == 0 ? 
    "green" : "red";
  context.fillText("Stroke: " + Math.round(1000*stroke.current)/1000,
                   width-100, height-20);
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
