var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
context.fillStyle = "red";
var width = canvas.width;
var height = canvas.height;
var controls = document.getElementById("controls");
var ctcontext = controls.getContext("2d");

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
var ball = new Movable(cb, 1);                           
ball.init(600, 1, 0, 0, 0);
           
var cooldowns = {toggle: 0, swim: 0};
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
var player = new Movable(u2, 1);//
player.init(600, 1, Math.PI, 0, 0);

function init() {
  render();
};

var omega = Math.PI/4;
var plomega = Math.PI/2;
var time = Date.now();
var dt;
var gravity = 0;//50;//2000;
var swimming = false;

var colHandler = new CollisionHandler();

function updateControls() {
  ctcontext.clearRect(0, 0, controls.width, controls.height);
  ctcontext.fillStyle = gravity != 0 ? "green" : "red";
  ctcontext.fillText("Gravity: q", 15, 20); 
  ctcontext.fillStyle = push == 1? "green" : "red"; 
  ctcontext.fillText("Pushing: w", 15, 35);
  ctcontext.fillStyle = swimming ? "green" : "red";
  ctcontext.fillText("Swimming: e", 15, 50);
  ctcontext.fillStyle = "green";
  ctcontext.fillText("Show help: h", 15, 65);
};
updateControls();

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
    if (swimming) {
      if (stroke.active == false) {
        if (stroke.current <= 0) {
          stroke.current += dt;
          player.dir.y -= 1;
          stroke.active = true;
        }
      } else {
        if (stroke.current < stroke.max) {
          stroke.current += dt;
          player.dir.y -= 1;
          if (stroke.current >= stroke.max)
            stroke.active = false;
        }
      }
    } else
      player.dir.y -= 1;
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

  if (keys["q"] && cooldowns.toggle <= 0) {
    cooldowns.toggle = cd;
    if (gravity <= 0)
      gravity = 50;
    else
      gravity = 0;
    updateControls();
  };

  if (keys["w"] && cooldowns.toggle <= 0) {
    cooldowns.toggle = cd;
    push = -push;
    updateControls();
  }

  if (keys["e"] && cooldowns.toggle <= 0) {
    cooldowns.toggle = cd;
    swimming = !swimming;
    updateControls();
  };

  if (keys["h"] && cooldowns.toggle <= 0) {
    cooldowns.toggle = cd;
    if (controls.style.visibility == "visible")
      controls.style.visibility = "hidden";
    else {
      controls.style.visibility = "visible";
      updateControls();
    }
  };
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
  
  lowerCooldowns(dt);
  player.dir.init(0, 0);
  handleInput(dt);
  player.move(dt);

  if (time % 40 <= 1)
    ;//ball.dir.init(2*Math.random()-1, 2*Math.random()-1 -gravity/1000);
  ball.move(dt);
  

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
          colHandler.resolve(p, q, mtv);
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
        colHandler.resolve(player, p, mtv);
      }
    }
    
    mtv = colHandler.collides(ball.shape, p);
    if (mtv != false) {
      colHandler.resolve(ball, p, mtv);
    }
  });
  
  _.forEach(borders, function (b) {
    b.setColliding(false);
    mtv = colHandler.collides(player.shape, b);
    if (mtv != false) {
      colHandler.resolve(player, b, mtv);
    }
    mtv = colHandler.collides(ball.shape, b);
    if (mtv != false) {
      colHandler.resolve(ball, b, mtv);
    }
  });

  mtv = colHandler.collides(player.shape, ball.shape);
  if (mtv != false) {
    colHandler.resolve(player, ball, mtv);
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

  if (swimming) {
    context.fillStyle = stroke.active || stroke.current == 0 ? 
      "green" : "red";
    context.fillText("Stroke: " + Math.round(1000*stroke.current)/1000,
                     width-100, height-20);
  }
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
