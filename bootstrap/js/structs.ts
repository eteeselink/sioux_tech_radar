
/// A class that mimicks some of the properties that the d3 force layout's
/// node objects have.
class D3Node {
  constructor(public x: number, public y: number) { }
  public px: number;
  public py: number;
  public fixed: number;
}
   
/// A polar coordinate, including methods to convert from and to
/// cartesian coordinates.
class Polar {
  constructor(public r: number, public phi: number) { }

  public static fromPoint(x: number, y: number) {
    y = -y;
    return new Polar(Math.sqrt(x * x + y * y), Math.atan2(y, x));
  }

  public x() {
    return this.r * Math.cos(this.phi);
  }
  public y() {
    return -this.r * Math.sin(this.phi);
  }
}

