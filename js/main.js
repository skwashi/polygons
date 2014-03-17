var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
context.fillStyle = "red";
var width = canvas.width;
var height = canvas.height;
var controls = document.getElementById("controls");
var ctcontext = controls.getContext("2d");

var lightmask = document.getElementById("lightmask");
var ctx = lightmask.getContext("2d");
ctx.globalCompositeOperation = "xor";

var polygons = [];
var sides = 0;
var poly;
for (var i = 0; i < 4; i++) {
  for (var j = 0; j < 4; j++) {
    if (i % 2 == 0 && j % 2 == 1 ||
        i % 2 == 1 && j % 2 == 0) {
      poly = new RegularPolygon(3+sides, 50, "red", new Vector(100+200*j, 75+150*i));
      polygons.push(poly);
      sides++;
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
var player = new Movable(u2, 50);//
player.init(600, 1, Math.PI, 0, 0, 0);

function init() {
  render();
};

var omega = Math.PI/4;
var plomega = Math.PI/2;
var time = Date.now();
var dt;
var gravity = 100;//50;//2000;
var gravitymax = 100;
var cr = 0.6;
var swimming = true;
var randomBall = false;
var string = new Vector(0,0);

var colHandler = new CollisionHandler();

function updateControls() {
  ctcontext.clearRect(0, 0, controls.width, controls.height);
  ctcontext.fillStyle = gravity != 0 ? "green" : "red";
  ctcontext.fillText("Gravity: q", 15, 20); 
  ctcontext.fillStyle = push == 1? "green" : "red"; 
  ctcontext.fillText("Pushing: w", 15, 35);
  ctcontext.fillStyle = swimming ? "green" : "red";
  ctcontext.fillText("Swimming: e", 15, 50);
  ctcontext.fillStyle = randomBall ? "green" : "red";
  ctcontext.fillText("Random ball: f", 15, 65);
  ctcontext.fillStyle = "green";
  ctcontext.fillText("Alter player mass: r/t", 15, 80);
  ctcontext.fillText("Alter ball mass: y/u", 15, 95);
  ctcontext.fillText("Change global elasticity: i/o", 15, 110);
  ctcontext.fillText("Show help: h", 15, 125);
  ctcontext.fillText("Player mass: " + player.mass, 15, 140);
  ctcontext.fillText("Ball mass: " + ball.mass, 15, 155);
  ctcontext.fillText("Elasticity: " + Math.round(100*cr)/100, 15, 170);
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
      gravity = gravitymax;
    else
      gravity = 0;
    updateControls();
  };

  if (keys["w"] && cooldowns.toggle <= 0) {
    cooldowns.toggle = cd;
    push = -push;
    updateControls();
  }

  if (keys["f"] && cooldowns.toggle <= 0) {
    cooldowns.toggle = cd;
    randomBall = !randomBall;
    updateControls();
  }

  if (keys["e"] && cooldowns.toggle <= 0) {
    cooldowns.toggle = cd;
    swimming = !swimming;
    updateControls();
  };

  if (keys["r"]) {
    player.mass--;
    if (player.mass < 1)
      player.mass = 1;
    updateControls();
  };

  if (keys["t"]) {
    player.mass++;
    updateControls();
  };

  if (keys["y"]) {
    ball.mass--;
    if (ball.mass < 1)
      ball.mass = 1;
    updateControls();
  };

  if (keys["u"]) {
    ball.mass++;
    updateControls();
  };

  if (keys["i"]) {
    cr -= 1/100;
    cr = cr <= 0 ? 0 : cr;
    updateControls();
  };

  if (keys["o"]) {
    cr += 1/100;
    cr = cr >= 1 ? 1 : cr;
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

  if (randomBall && time % 40 <= 1)
    ball.dir.init(2*Math.random()-1, 2*Math.random()-1 -gravity/1000);
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
          colHandler.resolve(p, q, mtv, cr);
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
        colHandler.resolve(player, p, mtv, cr);
      }
    }
    
    mtv = colHandler.collides(ball.shape, p);
    if (mtv != false) {
      colHandler.resolve(ball, p, mtv, cr);
    }
  });
  
  _.forEach(borders, function (b) {
    b.setColliding(false);
    mtv = colHandler.collides(player.shape, b);
    if (mtv != false) {
      colHandler.resolve(player, b, mtv, cr);
    }
    mtv = colHandler.collides(ball.shape, b);
    if (mtv != false) {
      colHandler.resolve(ball, b, mtv, cr);
    }
  });

  mtv = colHandler.collides(player.shape, ball.shape);
  if (mtv != false) {
    colHandler.resolve(player, ball, mtv, cr);
  }

  ball.pos.subtract(player.pos, string);

  if (string.length() >= 200 + 0.01) {
    var newString = new Vector(0, 0);
    newString.set(string);
    newString.scale(200/string.length());
    string.subtract(newString, newString);
    colHandler.resolve(player, ball, newString, cr);
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

  // draw string between player and ball
  context.beginPath();
  context.moveTo(player.pos.x, player.pos.y);
  context.lineTo(ball.pos.x, ball.pos.y);
  context.closePath();
  context.strokeStyle = "rgba(0,0,255,0.8)";
  context.stroke();

  if (swimming) {
    context.fillStyle = stroke.active || stroke.current == 0 ? 
      "green" : "red";
    context.fillText("Stroke: " + Math.round(1000*stroke.current)/1000,
                     width-100, height-20);
  }
};

function render() {
  requestAnimationFrame(render);
  context.clearRect(0,0,width,height);
  update();
  draw();

  var radius = 700;
  var intensity = 1;
  var amb = "rgba(0,0,0,0.9)";
  var c = Math.cos(player.angle);
  var s = Math.sin(player.angle);
  var x = player.pos.x;// + 200*c;
  var y = player.pos.y;// + 200*s;

  ctx.clearRect(0,0,width,height);
  ctx.fillStyle = amb;
  ctx.fillRect(0, 0, width, height);

 
  var g = ctx.createRadialGradient(x, y, 0,
                                   x, y, radius);
  //g.addColorStop(1, "white");
  g.addColorStop(1, 'rgba(0,0,0,0');// + (1-intensity) + ')');
  g.addColorStop(0, "rgba(0,0,0,0.95)");
   
  ctx.fillStyle = g;
  
  var d = 600;
  ctx.beginPath();
  ctx.moveTo(x, y);
  //ctx.lineTo(x+d*c+0.4*d*s, y+d*s-0.4*d*c);
  //ctx.lineTo(x+d*c-0.4*d*s, y+d*s+0.4*d*c);
  ctx.arc(x+d*c, y+d*s, 200, player.angle - 3*Math.PI/8, 
          player.angle + 3*Math.PI/8);
  ctx.closePath();
  ctx.fill();

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
