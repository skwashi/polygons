function CollisionHandler () {
  this.p1 = {min: 0, max: 0};
  this.p2 = {min: 0, max: 0};
  
  this.axis = new Vector(0, 0);
  this.mtv = new Vector(0, 0);
  this.dir = new Vector(0, 0);
};

CollisionHandler.prototype.overlap = function () {
  return !(this.p1.min > this.p2.max ||
           this.p2.min > this.p1.max);
};

CollisionHandler.prototype.getOverlap = function () {
  return Math.min(this.p1.max, this.p2.max) - Math.max(this.p1.min, this.p2.min);
};


CollisionHandler.prototype.collidesCC = function (c1, c2) {
  if (c1.center.distance(c2.center) <= c1.radius + c2.radius) {
    c1.setColliding(true);
    c2.setColliding(true);
    return true;
  } else
    return false; 
};


CollisionHandler.prototype.collidesAxes = function (shape1, axes1, 
                                                    shape2, axes2) {
  var smallest = null;
  var overlap = Number.MAX_VALUE;
  var o;

  for (var i = 0; i < axes1.length; i++) {
    shape1.project(axes1[i], this.p1);
    shape2.project(axes1[i], this.p2);
    if (!this.overlap())
      return false;
    else {
      o = this.getOverlap();
      if (o < overlap) {
        overlap = o;
        smallest = axes1[i];
      }
    }
  }

  for (var j = 0; j < axes2.length; j++) {
    shape1.project(axes2[j], this.p1);
    shape2.project(axes2[j], this.p2);
    if (!this.overlap())
      return false;
    else {
      o = this.getOverlap();
      if (o < overlap) {
        overlap = o;
        smallest = axes2[j];
      }
    }
  }

  this.mtv.set(smallest);
  shape2.center.subtract(shape1.center, this.dir);  

  if (this.dir.dot(this.mtv) > 0)
    this.mtv.scale(-overlap);
  else
    this.mtv.scale(overlap);
  
  shape1.setColliding(true);
  shape2.setColliding(true);
  return this.mtv;
};

CollisionHandler.prototype.collidesPC = function (poly, circle) {
  if (!poly.updated) {
    poly.computeEdges();
    poly.computeNormals();
  }

  var d = Number.MAX_VALUE;
  var l;
  var v;
  _.forEach(poly.vertices, function (vtx) {
    circle.center.subtract(vtx, this.axis);
    l = this.axis.length();
    if (l < d) {
      d = l;
      v = vtx;
    }
  }, this);
  circle.center.subtract(v, this.axis);
  this.axis.div(l);

  return this.collidesAxes(poly, poly.normals,
                           circle, [this.axis]);
  
};

CollisionHandler.prototype.collidesPP = function (poly1, poly2) {
  if (!poly1.updated) {
    poly1.computeEdges();
    poly1.computeNormals();
  }

  if (!poly2.updated) {
    poly2.computeEdges();
    poly2.computeNormals();
  }

  return this.collidesAxes(poly1, poly1.normals,
                           poly2, poly2.normals);
  
};


CollisionHandler.prototype.collides = function (shape1, shape2) {
  if (!shape1.collides(shape2))
    return false;

  var col = false;
  if (shape1 instanceof Union) {
    for (var i = 0, len = shape1.shapes.length; i < len; i++) {
      col = this.collides(shape1.shapes[i], shape2);
      if (col != false)
        return col;
    }
    return false;
  } else if (shape2 instanceof Union) {
    for (var j = 0, l = shape1.shapes.length; j < l; j++) {
      col = this.collides(shape1, shape2.shapes[j]);
      if (col != false)
        return col;
    }
    return false;
  }

  if (shape1 instanceof Polygon) {
    if (shape2 instanceof Polygon)
      return this.collidesPP(shape1, shape2);
    else if (shape2 instanceof Circle)
      return this.collidesPC(shape1, shape2);
    else
      return false;
  } else if (shape1 instanceof Circle) {
    if (shape2 instanceof Circle)
      return this.collidesCC(shape1, shape2);
    else if (shape2 instanceof Polygon)
      return this.collidesPC(shape2, shape1);
    else
      return false;
  } else
    return false;
};
