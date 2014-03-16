function Circle(center, radius, color) {
  Shape.call(this);
  // this.bounds.min
  // this.bounds.max

  this.center = center;
  this.radius = radius;
  this.color = color;

  // initialize stuff
  this.computeBounds();
}
Circle.prototype = Object.create(Shape.prototype);

Circle.prototype.computeBounds = function () {
  this.bounds.min.init(this.center.x - this.radius,
                          this.center.y - this.radius),
  this.bounds.max.init(this.center.x + this.radius,
                       this.center.y + this.radius);
};

Circle.prototype.translate = function (vector) {
  this.center.inc(vector);
  Shape.prototype.translate.call(this, vector);
};

Circle.prototype.rotate = function (angle, pivot) {
  if (pivot != undefined) {
    this.center.rotate(angle, pivot);
    this.computeBounds();
  }
};

Circle.prototype.contains = function (vector) {
  return (this.center.distance(vector) <= this.radius);
};

Circle.prototype.draw = function (ctx) {
  ctx.beginPath();
  ctx.arc(this.center.x, this.center.y, this.radius, 0, 2*Math.PI);
  ctx.fillStyle = this.color;//this.colliding ? "black" : this.color;
  ctx.fill();
};

Circle.prototype.project = function (axis, out) {
  var c = this.center.dot(axis);
  out.min = c - this.radius;
  out.max = c + this.radius;
};
