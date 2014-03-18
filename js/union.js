function Union(shapes, position) {
  Shape.call(this);

  this.shapes = shapes;
  this.center = new Vector(0, 0);

  // initialize stuff

  this.computeCenter();
  
  if (position != undefined)
    this.moveTo(position);

  this.computeBounds();
  this.computeArea();
  this.computeInertia();
  this.color = "grey";
};
Union.prototype = Object.create(Shape.prototype);

Union.prototype.computeArea = function () {
  this.area = _.reduce(this.shapes, function(sum, shape) {
    return sum + shape.area;
  });
};

Union.prototype.computeInertia = function () {
  var r = new Vector(0,0);
  this.inertia = _.reduce(this.shapes, function(sum, shape) {
    shape.center.subtract(this.center, r);
    return sum + shape.inertia + r.length()*r.length();
  }, 0, this);
};

Union.prototype.computeCenter = function () {
  this.center.init(0,0);
  _.forEach(this.shapes, function (shape) {
    this.center.inc(shape.center);
  }, this);
  this.center.div(this.shapes.length);
};

Union.prototype.computeBounds = function () {
  this.bounds.min.init(Number.MAX_VALUE, Number.MAX_VALUE);
  this.bounds.max.init(Number.MIN_VALUE, Number.MIN_VALUE);
  
  _.forEach(this.shapes, function (shape) {
    this.bounds.min.setMin(shape.bounds.min);
    this.bounds.max.setMax(shape.bounds.max);
  }, this);
};

Union.prototype.translate = function (vector) {
  this.center.inc(vector);
  _.forEach(this.shapes, function (shape) {shape.translate(vector);});
  Shape.prototype.translate.call(this, vector);
};

Union.prototype.rotate = function (angle, pivot) {
  var p = this.center;
  if (pivot != undefined) {
    this.center.rotate(angle. pivot);
    p = pivot;
  }
  _.forEach(this.shapes, function (shape) {
    shape.rotate(angle, p);
  });
  this.computeBounds();
};

Union.prototype.transform = function (a, b, c, d, o) {
  var p = this.center;
  if (o != undefined) {
    this.center.transform(a, b, c, d, o);
    p = o;
  }
  _.forEach(this.shapes, function (shape) {
    shape.transform(a, b, c, d, p);
  });
  this.computeBounds();
};

Union.prototype.draw = function (ctx) {
  _.forEach(this.shapes, function (shape) {
    shape.draw(ctx);
  });
};

Union.prototype.drawBounds = function (ctx) {
  Shape.prototype.draw.call(this, ctx);  
  _.forEach(this.shapes, function (shape) {
    shape.drawBounds(ctx);
  });
};

Union.prototype.setColliding = function (col) {
  _.forEach(this.shapes, function (shape) {shape.colliding = col;});
};
