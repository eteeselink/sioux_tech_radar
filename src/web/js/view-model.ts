/// <reference path="structs.ts" />
/// <reference path="radar.ts" />
/// <reference path="socket.ts" />
/// <reference path="utils.ts" />


module TechRadar.Client{
  var deg45 = Math.PI / 4;

  /// Emulation of an "enum" with 4 elements. The good thing about
  /// faking an enum with a class and statics is that you can add methods, more
  /// like Java and less like C(#/++/)
  export class Quadrant extends Enum {
    constructor(public xloc: number, public yloc: number, public angle: number) { super(Quadrant); }

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
  export class Thing extends D3Node {
    constructor(
      public name: string,
      public quadrant: Quadrant,
      goodness: number,   // between 0.0 and 1.0; closer to zero is better
    ) {
      super(null, null);
      var r = goodness * Radar.radius;

      var phi = quadrant.angle + random(0.01, 0.02);
      this.polar = new Polar(r, phi);
      this.updateXY();

      
    }
   
    private setupListener(){
      var socket = Bus.Thing();
      socket.on(name, (data:any)=>{
        console.log("yay got("+name+") data "+JSON.stringify(data));
      });
      socket.emit("register", name);
    }
    private notifyServer(){
      var socket = Bus.Thing();
      socket.emit(name, this.goodness());
    }


    public polar: Polar;
    public prevPolar: Polar;

    public updatePolar() {
      this.prevPolar = this.polar;
      this.polar = Polar.fromPoint(this.x, this.y);
      this.notifyServer();
    }

    public fixRadius(goodnessEditable: bool) {
      if ((!this.isBeingDragged()) || (!goodnessEditable)) {
        this.polar.r = this.prevPolar.r;
        this.notifyServer();
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
}
