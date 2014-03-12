function Vector(x, y) {
  this.x = x;
  this.y = y;

  this.init = function (x, y) {
    this.x = x;
    this.y = y;
    return this;
  };

  this.set = function (v) {
    this.x = v.x;
    this.y = v.y;
    return this;
  };
  
  this.inc = function (v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  };

  this.dec = function (v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  };

  this.scale = function (a) {
    this.x *= a;
    this.y *= a;
    return this;
  };

  this.div = function (a) {
    this.x /= a;
    this.y /= a;
  };

  this.normalize = function () {
    var l = this.length();
    if (l != 0) {
      this.x /= l;
      this.y /= l;
    }
    return this;
  };

  this.isZero = function () {
    return (this.x == 0 && this.y == 0);
  };

}

Vector.prototype.clone = function () {
  return new Vector(this.x, this.y);
};

Vector.prototype.distance = function (v) {
  var x = v.x - this.x;
  var y = v.y - this.y;
  return Math.sqrt(x*x + y*y);
};

Vector.prototype.equals = function (v) {
  return this.x == v.x && this.y == v.y;
};

Vector.prototype.copy = function (out) {
  out.x = this.x;
  out.y = this.y;
};

Vector.prototype.add = function (v, out) {
  out.x = v.x + this.x;
  out.y = v.y + yhis.y;
};

Vector.prototype.subtract = function (v, out) {
  out.x = this.x - v.x;
  out.y = this.y - v.y;
};

Vector.prototype.length = function () {
  return Math.sqrt(this.x*this.x + this.y*this.y);
};

Vector.prototype.multiply = function (a, out) {
  out.x = a*this.x;
  out.y = a*this.y;
};

Vector.prototype.dot = function (v) {
  return this.x * v.x + this.y * v.y;
};

Vector.prototype.normal = function (out) {
    var l = this.length();
    if (l != 0) {
      out.x = this.x /= l;
      out.y = this.y /= l;
    } else {
      out.x = 0;
      out.y = 0;
    }
};

Vector.prototype.setMax = function (v) {
  this.x = Math.max(this.x, v.x);
  this.y = Math.max(this.y, v.y);
};

Vector.prototype.setMin = function (v, out) {
  this.x = Math.min(this.x, v.x);
  this.y = Math.min(this.y, v.y);
};

Vector.prototype.makeNormal = function () {
  var l = this.length();
  if (l != 0)
    return new Vector(this.x / l, this.y / l);
  else
    return new Vector(0, 0);
};

Vector.prototype.rotate = function (angle) {
  var x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
  this.y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
  this.x = x;
};

Vector.prototype.lt = function (v) {
  return this.x < v.x || this.y < v.y;  
};

Vector.prototype.gt = function (v) {
  return this.x > v.x || this.y > v.y;
};

Vector.prototype.transform = function(a, b, c, d, o) {
  var dx = this.x - o.x;
  var dy = this.y - o.y;
  this.x = a*dx + b*dy + o.x;
  this.y = c*dx + d*dy + o.y;
};
