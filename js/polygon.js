function Polygon(vectors, color, center) {
  this.vertices = vectors;
  this.color = color;
  this.center = new Vector(0, 0);
  this.bounds = {min: new Vector(0, 0), max: new Vector(0, 0)};

  this.edges = [];
  this.normals = [];
  
  // initialize stuff
  this.computeBounds();
  if (center != undefined)
    this.translate(center);
  this.computeEdges();
  this.computeNormals();
};

Polygon.prototype.computeBounds = function () {
  this.bounds.min.init(Number.MAX_VALUE, Number.MAX_VALUE);
  this.bounds.max.init(Number.MIN_VALUE, Number.MIN_VALUE);
  
  _.forEach(this.vertices, function (v) {
    this.bounds.min.setMin(v);
    this.bounds.max.setMax(v);
  }, this);
};

Polygon.prototype.computeEdges = function () {
  var p1, p2;
  if (this.edges.length == 0)
    for (var i = 0; i < this.vertices.length; i++) {
      this.edges[i] = new Vector(0, 0);
    }
  
  for (var j = 0, len = this.vertices.length; j < len; j++) {
    p1 = this.vertices[j];
    p2 = this.vertices[(j+1) % len];
    p2.subtract(p1, this.edges[j]);
  }
};

Polygon.prototype.computeNormals = function () {
  if (this.normals.length == 0)
    for (var j = 0; j < this.edges.length; j++)
      this.normals[j] = new Vector(0, 0);
  
  for (var i = 0; i < this.edges.length; i++) {
    this.edges[i].perp(this.normals[i]);
  }
};

Polygon.prototype.translate = function (vector) {
  this.center.inc(vector);
  this.bounds.min.inc(vector);
  this.bounds.max.inc(vector);
  _.forEach(this.vertices, function (vtx) {vtx.inc(vector);});
};

Polygon.prototype.transform = function (a, b, c, d, o) {
  var p = o || this.center;
  _.forEach(this.vertices, function (vtx) {vtx.transform(a, b, c, d, p);});
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

Polygon.prototype.drawNormals = function (ctx) {
  ctx.strokeStyle = "black";
  ctx.globalAlpha = 1;
  _.forEach(this.vertices, function (vtx, i) {
    ctx.beginPath();
    ctx.moveTo(vtx.x, vtx.y);
    ctx.lineTo(vtx.x + this.normals[i].x, vtx.y + this.normals[i].y);
    ctx.closePath();
    ctx.stroke();
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

Polygon.prototype.project = function (axis, out) {
  var min = this.vertices[0].dot(axis);
  var max = min;

  var p;
  for (var i = 1; i < this.vertices.length; i++) {
    p = this.vertices[i].dot(axis);
    if (p < min)
      min = p;
    else if (p > max)
      max = p;
  }

  out.min = min;
  out.max = max;
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
