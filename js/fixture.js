function Fixture(shape, density, fr, cr, body) {
  this.shape = shape;
  this.m = density * shape.A;
  this.fr = fr;
  this.cr = cr;
  this.body = body || null;
};

Fixture.prototype.setBody = function (body) {
  this.body = body;
};
