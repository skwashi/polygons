function Polygon(vectors, color, center) {
  Shape.call(this);
  // this.bounds.min
  // this.bounds.max

  this.vertices = vectors;
  this.color = color;
  this.center = new Vector(0, 0);

  this.edges = [];
  this.normals = [];

  this.updated = false;

  this.computeBounds();  
  // initialize stuff
  if (center != undefined)
    this.translate(center);
  else
    this.computeCenter();

  this.computeEdges();
  this.computeNormals();
};
Polygon.prototype = Object.create(Shape.prototype);

Polygon.prototype.computeCenter = function () {
  this.center.init(0, 0);
  _.forEach(this.vertices, function (vtx) {this.center.inc(vtx);}, this);
  this.center.div(this.vertices.length);
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
    this.edges[i].perpNormal(this.normals[i]);
  }
  this.updated = true;
};

Polygon.prototype.translate = function (vector) {
  this.center.inc(vector);
  _.forEach(this.vertices, function (vtx) {vtx.inc(vector);});
  Shape.prototype.translate.call(this, vector);
};

Polygon.prototype.moveTo = function (position) {
  this.translate(new Vector(position.x - this.center.x, 
                             position.y - this.center.y));
};

Polygon.prototype.transform = function (a, b, c, d, o) {
  var p = this.center;
  if (o != undefined) {
    this.center.transform(a, b, c, d, o);
    p = o;
  }
  _.forEach(this.vertices, function (vtx) {vtx.transform(a, b, c, d, p);});
  this.computeBounds();
  this.updated = false;
};

Polygon.prototype.rotate = function (angle, pivot) {
  var p = this.center;
  if (pivot != undefined) {
    this.center.rotate(angle, pivot);
    p = pivot;
  }
  var c = Math.cos(angle);
  var s = Math.sin(angle);
  var dx, dy;
  _.forEach(this.vertices, function (vtx) {
    dx = vtx.x - p.x;
    dy = vtx.y - p.y;
    vtx.x = c*dx - s*dy + p.x;
    vtx.y = s*dx + c*dy + p.y;
  });
  this.computeBounds();
  this.updated = false;
};

Polygon.prototype.draw = function (ctx) {
  ctx.beginPath();
  ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
  _.forEach(this.vertices, function (vtx) {ctx.lineTo(vtx.x, vtx.y);});
  ctx.closePath();
  ctx.fillStyle = this.colliding ? "black" : this.color;
  ctx.fill();
};

Polygon.prototype.drawBounds = function (ctx) {
  Shape.prototype.draw.call(this, ctx);
};

Polygon.prototype.drawNormals = function (ctx) {
  ctx.strokeStyle = "black";
  _.forEach(this.vertices, function (vtx, i) {
    ctx.beginPath();
    ctx.moveTo(vtx.x, vtx.y);
    ctx.lineTo(vtx.x + this.normals[i].x, vtx.y + this.normals[i].y);
    ctx.closePath();
    ctx.stroke();
  }, this);
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

function RegularPolygon(n, radius, color, center, angle) {
  var vertices = [];
  var da = Math.PI * 2/n;
  var a = angle || 0;
  for (var i = 0; i < n; i++) {
    vertices.push(new Vector(radius * Math.cos(a), radius * Math.sin(a)));
    a += da;
  };
  Polygon.call(this, vertices, color, center);
};
RegularPolygon.prototype = Object.create(Polygon.prototype);


function Rectangle(x, y, w, h, color) {
  var vectors = [new Vector(x,y), new Vector(x+w, y),
                 new Vector(x+w,y+h), new Vector(x, y+h)];
  Polygon.call(this, vectors, color);
};
Rectangle.prototype = Object.create(Polygon.prototype);

Rectangle.prototype.computeNormals = function () {
  if (this.normals.length == 0) {
    this.normals[0] = new Vector(0, 0);
    this.normals[1] = new Vector(0, 0);
  }

  this.edges[0].perpNormal(this.normals[0]);  
  this.edges[1].perpNormal(this.normals[1]);  
};
