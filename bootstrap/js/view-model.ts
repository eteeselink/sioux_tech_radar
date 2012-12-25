/// <reference path="structs.ts" />
/// <reference path="tech-radar.ts" />

var deg45 = Math.PI / 4;

/// Emulation of an "enum" with 4 elements. The good thing about
/// faking an enum with a class and statics is that you can add methods
class Quadrant {
  constructor(public angle: number) {}

  public static Tools      = new Quadrant( 1 * deg45);
  public static Techniques = new Quadrant( 3 * deg45);
  public static Platforms  = new Quadrant(-3 * deg45);
  public static Languages  = new Quadrant(-1 * deg45);

  public angleLower() {
    return this.angle - deg45;
  }

  public angleUpper() {
    return this.angle + deg45;
  }

  public isLeft() {
    return Math.abs(this.angle) < (Math.PI / 2);
  }
}

/// View model for a "thing" that can be positioned at some place
/// on the technology radar.
class Thing extends D3Node {
  constructor(
    public name: string, 
    public quadrant: Quadrant, 
    goodness: number,   // between 0.0 and 1.0; closer to zero is better
  ) {
    super(null, null);
    var r = goodness * Radar.radius;
    
    var phi = quadrant.angle;  //random(quadrant.angleLower(), quadrant.angleUpper());
    this.polar = new Polar(r, phi);
    this.updateXY();
  }

  public polar: Polar;
  public prevPolar: Polar;

  public updatePolar() {
    this.prevPolar = this.polar;
    this.polar = Polar.fromPoint(this.x, this.y);
  } 

  public fixRadius() {
    if (!this.isBeingDragged()) {
      this.polar.r = this.prevPolar.r;
    }
  }

  public updateXY() {
    this.x = this.polar.x();
    this.y = this.polar.y();
  }

  public isBeingDragged() {
    return this.fixed & 2;
  }
  public goodness() {
    return this.polar.r / Radar.radius;
  }
}
