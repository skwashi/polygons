function CollisionHandler () {
  this.p1 = {min: 0, max: 0};
  this.p2 = {min: 0, max: 0};
  
  this.axis = new Vector(0, 0);
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
    c1.colliding = true;
    c2.colliding = true;
    return true;
  } else
    return false; 
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

  for (var i = 0; i < poly.normals.length; i++) {
    poly.project(poly.normals[i], this.p1);
    circle.project(poly.normals[i], this.p2);
    if (!this.overlap())
      return false;
  }

  poly.project(this.axis, this.p1);
  circle.project(this.axis, this.p2);

  if (!this.overlap())
    return false;
  
  poly.colliding = true;
  circle.colliding = true;
  return true;
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
  

  for (var i = 0; i < poly1.normals.length; i++) {
    poly1.project(poly1.normals[i], this.p1);
    poly2.project(poly1.normals[i], this.p2);
    if (!this.overlap())
      return false;
  }

  for (var j = 0; j < poly2.normals.length; j++) {
    poly1.project(poly2.normals[j], this.p1);
    poly2.project(poly2.normals[j], this.p2);
    if (!this.overlap())
      return false;
  }
  
  poly1.colliding = true;
  poly2.colliding = true;
  return true;
};


CollisionHandler.prototype.collides = function (shape1, shape2) {
  if (!shape1.collides(shape2))
    return false;

  var col = false;
  if (shape1 instanceof Union) {
    for (var i = 0, len = shape1.shapes.length; i < len; i++) {
      if (this.collides(shape2, shape1.shapes[i]))
        col = true; // return true;
    }
    return col; //return false;
  } else if (shape2 instanceof Union) {
    for (var j = 0, l = shape1.shapes.length; j < l; j++) {
      if (this.collides(shape1, shape2.shapes[j]))
        col = true; // return true
    }
    return col; // return false
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
