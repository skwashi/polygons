function CollisionHandler () {
  this.p1 = {min: 0, max: 0};
  this.p2 = {min: 0, max: 0};
};

CollisionHandler.prototype.overlap = function () {
  return !(this.p1.min > this.p2.max ||
           this.p2.min > this.p1.max);
};

CollisionHandler.prototype.getOverlap = function () {
  return Math.min(this.p1.max, this.p2.max) - Math.max(this.p1.min, this.p2.min);
};

CollisionHandler.prototype.collides = function (poly1, poly2) {
  if (!poly1.collides(poly2))
    return false;

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
  
  return true;
};
