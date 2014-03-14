function Movable (shape, position) {
  this.shape = shape;
  if (position != undefined)
    shape.moveTo(position);

  this.pos = shape.center;
  this.v = new Vector(0, 0);
  this.f = 0;
  this.drag = 0;

  // working vectors
  this.dir = new Vector(0, 0);
  this.dp = new Vector(0, 0);

  this.init = function (f, drag, vx, vy) {
    this.f = f;
    this.drag = drag;
    this.v.x = vx || 0;
    this.v.y = vy || 0;
  };

}

Movable.prototype.move = function (dt) {
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
