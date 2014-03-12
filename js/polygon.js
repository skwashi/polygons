function Polygon(vectors, center, angle) {
  this.vertices = vectors;
  this.center = center;
  this.angle = angle;

  this.bounds = {min: new Vector(0, 0), max: new Vector(0, 0)};
  
  // initialize stuff
  this.computeBounds();
};

Polygon.prototype.translate = function (v) {
  this.center.translate(vector);
};

Polygon.prototype.translate2 = function (v) {
  this.center.inc(vector);
  this.bounds.min.inc(v);
  this.bounds.max.inc(v);
  _.forEach(this.vertices, function (v) {v.increase(vector);});
};

Polygon.prototype.rotate = function (angle) {
  this.angle += angle;
};

Polygon.prototype.rotate2 = function (angle) {
  this.angle += angle;
  _.forEach(this.vertices, function (v) {v.rotate(angle);});
};

Polygon.prototype.draw = function (ctx) {
  ctx.save();
  ctx.translate(this.center.x, this.center.y);
  //ctx.rotate(this.angle);
  ctx.beginPath();
  ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
  for (var i = 1; i < this.vertices.length; i++)
     ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};

Polygon.prototype.drawBounds = function (ctx) {
  ctx.save();
  ctx.translate(this.center.x, this.center.y);
  ctx.beginPath();
  ctx.moveTo(this.bounds.min.x, this.bounds.min.y);
  ctx.lineTo(this.bounds.max.x, this.bounds.min.y);
  ctx.lineTo(this.bounds.max.x, this.bounds.max.y);
  ctx.lineTo(this.bounds.min.x, this.bounds.max.y);
  ctx.closePath();
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = "grey";
  ctx.fill();
  ctx.restore();
};


Polygon.prototype.computeBounds = function () {
  this.bounds.min.init(Number.MAX_VALUE, Number.MAX_VALUE);
  this.bounds.max.init(Number.MIN_VALUE, Number.MIN_VALUE);
  
  _.forEach(this.vertices, function (v) {
    this.bounds.min.setMin(v);
    this.bounds.max.setMax(v);
  }, this);
};

function RegularPolygon(n, radius, center, angle) {
  var vertices = [];
  var da = Math.PI * 2/n;
  var a = 0;
  for (var i = 0; i < n; i++) {
    vertices.push(new Vector(radius * Math.cos(a), radius * Math.sin(a)));
    a += da;
  };
  Polygon.call(this, vertices, center, angle);
};
RegularPolygon.prototype = Object.create(Polygon.prototype);
