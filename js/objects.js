function Movable (shape, mass, position) {
  this.shape = shape;
  if (position != undefined)
    shape.moveTo(position);

  this.mass = mass || 1;
  this.inertia = shape.inertia;

  console.log(this.inertia);
  this.pos = shape.center;
  this.v = new Vector(0, 0);
  this.ω = 0;
  this.f = 0;
  this.drag = 0;
  this.omega = 0;
  this.aDrag = 0.1;
  this.torque = 6000000;

  this.angle = -Math.PI/2;

  // working vectors
  this.dir = new Vector(0, 0);
  this.dp = new Vector(0, 0);

  this.init = function (f, drag, omega, vx, vy, ω) {
    this.f = f;
    this.drag = drag;
    this.omega = omega || 0;
    this.v.x = vx || 0;
    this.v.y = vy || 0;
    this.ω = ω || 0;
  };

}

Movable.prototype.translate = function (vector) {
  this.shape.translate(vector);
};

Movable.prototype.setShape = function (shape) {
  this.shape = shape;
  this.pos = shape.center;
};

Movable.prototype.move = function (dt) {
  if (this.omega != 0) {
    var dir = this.dir;
    this.ω -= this.ω*Math.min(1,8*dt);
    this.ω += dir.x * (this.torque / (this.mass*this.inertia)) * dt;
    this.shape.rotate(this.ω*dt);
    this.angle += this.ω*dt;

    dir.x = -dir.y * Math.cos(this.angle);
    dir.y = -dir.y * Math.sin(this.angle);
  }

  this.v.x += this.f * this.dir.x * dt;
  this.v.y += this.f * this.dir.y * dt + gravity * dt;

  this.v.x -= this.v.x*Math.min(1, this.drag*dt);
  this.v.y -= this.v.y*Math.min(1, this.drag*dt);
  
  this.v.multiply(dt, this.dp);
  this.shape.translate(this.dp);

};

Movable.prototype.draw = function (ctx) {
  this.shape.drawBounds(ctx);
  this.shape.draw(ctx);
};
