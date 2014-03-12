function Polygon(vectors, color, center) {
  this.vertices = vectors;
  this.color = color;
  this.center = new Vector(0, 0);
  this.bounds = {min: new Vector(0, 0), max: new Vector(0, 0)};

  this.edges = [];
  
  // initialize stuff
  this.computeBounds();
  if (center != undefined)
    this.translate(center);
  //this.computeEdges();
};

Polygon.prototype.translate = function (vector) {
  this.center.inc(vector);
  this.bounds.min.inc(vector);
  this.bounds.max.inc(vector);
  _.forEach(this.vertices, function (vtx) {vtx.inc(vector);});
};

Polygon.prototype.rotate = function (angle, pivot) {
  var p = pivot || this.center;
  var c = Math.cos(angle);
  var s = Math.sin(angle);
  var dx, dy;
  _.forEach(this.vertices, function (vtx) {
    dx = vtx.x - p.x;
    dy = vtx.y - p.y;
    vtx.x = c*dx - s*dy + p.x;
    vtx.y = s*dx + c*dy + p.y;
  });
};

Polygon.prototype.draw = function (ctx) {
  ctx.beginPath();
  ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
  _.forEach(this.vertices, function (vtx) {ctx.lineTo(vtx.x, vtx.y);});
  ctx.closePath();
  ctx.fillStyle = this.color;
  ctx.globalAlpha = 1;
  ctx.fill();
};

Polygon.prototype.drawBounds = function (ctx) {
  ctx.beginPath();
  ctx.moveTo(this.bounds.min.x, this.bounds.min.y);
  ctx.lineTo(this.bounds.max.x, this.bounds.min.y);
  ctx.lineTo(this.bounds.max.x, this.bounds.max.y);
  ctx.lineTo(this.bounds.min.x, this.bounds.max.y);
  ctx.closePath();
  ctx.fillStyle = this.color;
  ctx.globalAlpha = 0.2;
  ctx.fill();
};

Polygon.prototype.computeBounds = function () {
  this.bounds.min.init(Number.MAX_VALUE, Number.MAX_VALUE);
  this.bounds.max.init(Number.MIN_VALUE, Number.MIN_VALUE);
  
  _.forEach(this.vertices, function (v) {
    this.bounds.min.setMin(v);
    this.bounds.max.setMax(v);
  }, this);
};

Polygon.prototype.contains = function (vector) {
  if (vector.x > this.bounds.max.x || vector.x < this.bounds.min.x ||
      vector.y > this.bounds.max.y || vector.y < this.bounds.min.y)
    return false;
  else
    return true;
};

Polygon.prototype.collides = function (polygon) {
  if (polygon.bounds.min.gt(this.bounds.max) ||
      polygon.bounds.max.lt(this.bounds.min))
    return false;
  else
    return true;  
};

function RegularPolygon(n, radius, color, center) {
  var vertices = [];
  var da = Math.PI * 2/n;
  var a = 0;
  for (var i = 0; i < n; i++) {
    vertices.push(new Vector(radius * Math.cos(a), radius * Math.sin(a)));
    a += da;
  };
  Polygon.call(this, vertices, color, center);
};
RegularPolygon.prototype = Object.create(Polygon.prototype);
