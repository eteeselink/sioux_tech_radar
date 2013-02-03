/// <reference path="structs.ts" />
/// <reference path="radar.ts" />
/// <reference path="socket.ts" />

import Structs = module('structs')
import RadarModule = module('radar')
import Socket = module('socket')

var deg45 = Math.PI / 4;

/// base class for fake enums; searches the constructor object
/// for a slow but functional toString implementation.
class Enum {
  public toString() : string {
    var classObj = this['constructor'];
    for (var key in classObj) {
      if (Quadrant[key] === this) {
        return key;
      }
    }
    return null;
  }
}

/// Emulation of an "enum" with 4 elements. The good thing about
/// faking an enum with a class and statics is that you can add methods, more
/// like Java and less like C(#/++/)
export class Quadrant extends Enum {
  constructor(public xloc: number, public yloc: number, public angle: number) { super(); }

  public static Tools      = new Quadrant( 1, -1,  1 * deg45);
  public static Techniques = new Quadrant(-1, -1,  3 * deg45);
  public static Platforms  = new Quadrant(-1,  1, -3 * deg45);
  public static Languages  = new Quadrant( 1,  1, -1 * deg45);

  public angleLower() {
    return this.angle - deg45;
  }

  public angleUpper() {
    return this.angle + deg45;
  }

  public isLeft() {
    return this.xloc < 0;
  }

  public isTop() {
    return this.yloc < 0;
  }
}

/// View model for a "thing" that can be positioned at some place
/// on the technology radar.
export class Thing extends Structs.D3Node {
  constructor(
    public name: string,
    public quadrant: Quadrant,
    goodness: number,   // between 0.0 and 1.0; closer to zero is better
  ) {
    super(null, null);
    var r = goodness * RadarModule.Radar.radius;

    var phi = quadrant.angle + RadarModule.random(0.01, 0.02);
    this.polar = new Structs.Polar(r, phi);
    this.updateXY();
    var socket = Socket.Bus.Thing();
    socket.on(name,this.notify);
    socket.emit("register", name);
  }
  public notify(data:any){
      console.log("yay got("+name+") data "+JSON.stringify(data));
  }
  public polar: Structs.Polar;
  public prevPolar: Structs.Polar;

  public updatePolar() {
    this.prevPolar = this.polar;
    this.polar = Structs.Polar.fromPoint(this.x, this.y);
  }

  public fixRadius(goodnessEditable: bool) {
    if ((!this.isBeingDragged()) || (!goodnessEditable)) {
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
    return this.polar.r / RadarModule.Radar.radius;
  }
}
