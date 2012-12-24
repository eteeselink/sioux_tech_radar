// Definitions from https://github.com/borisyankov/DefinitelyTyped
/// <reference path="jquery-1.8.d.ts" />
/// // <reference path="d3-2.10.d.ts" />

declare var d3: any;

var deg45 = Math.PI / 4;

class Quadrant {
  constructor(public angle: number) {}

  public static Tools      = new Quadrant(1 * deg45);
  public static Techniques = new Quadrant(3 * deg45);
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

class D3Node {
  constructor(public x: number, public y: number) { }  
  public px: number;
  public py: number;
  public fixed: number;
}

class D3Link {
  constructor(public source: D3Node, public target: D3Node) { }
}


class Thing extends D3Node {
  constructor(
    public name: string, 
    public quadrant: Quadrant, 
    goodness: number,   // between 0.0 and 1.0; closer to zero is better
  ) {
    super(null, null);
    var r = goodness * Radar.radius;
    
    var phi = random(quadrant.angleLower(), quadrant.angleUpper());
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


function random(from: number, to: number) {
  var domain = to - from;
  return Math.random() * domain + from;
}

function cap(lowerBound: number, value: number, upperBound: number) {
  return Math.max(lowerBound, Math.min(upperBound, value));
}


class Radar {
  constructor(
    private width: number,
  ) {

    //// create transforms and other plot-related constants

    var halfWidth = this.width / 2;

    this.transformx = d3.scale.linear()
      .domain([-Radar.radius, Radar.radius])
      .range([halfWidth, 3 * halfWidth]);

    this.transformy = d3.scale.linear()
      .domain([-Radar.radius, Radar.radius])
      .range([0, this.width]);

    this.scale = d3.scale.linear()
      .domain([0, Radar.radius * 2])
      .range([0, this.width]);

    this.svg = d3.select("body").append("svg")
      .attr("width", width * 2)
      .attr("height", width);

    this.drawBackground();

    this.force = d3.layout.force()
      .nodes([])
      .size([Radar.radius * 2, Radar.radius * 2])
      .gravity(0)
      .charge(-100)
      .on("tick", e => this.tick(e));

    this.things = <Thing[]>this.force.nodes();
  }

  // the distance from the origin to each of the four edges
  // i.e. the radar's radius. hard-coded to 200 because some of the
  // force's constants depend on it
  public static radius = 200;

  private transformx: (number) => number;
  private transformy: (number) => number;
  private scale: (number) => number;
  private svg: any;
  private force: any;
  private things: Thing[];
  private quadrantGravity = 0.03;
  
  private tick(e: any) {
    
    // change every node's newly computed position such that
    // the distance from the origin (r) never changes, and only 
    // its angle (phi) can.
    for (var i = 0; i != this.things.length; i++) {
      var thing = this.things[i];
      
      // "read" the newly computed x,y values into `thing.polar`.
      thing.updatePolar();

      // set the thing's radius to whatever it was, unless we're being dragged
      thing.fixRadius();
      
      // enable "quadrant gravity", pulling each node a bit to the centre diagonal
      // of its quadrant
      thing.polar.phi += (thing.quadrant.angle - thing.polar.phi) * e.alpha * this.quadrantGravity;

      var borderOffset = 10 / (thing.polar.r + 0.1);
      // ensure that nodes never leave their quadrant
      thing.polar.phi = cap(thing.quadrant.angleLower() + borderOffset, thing.polar.phi, thing.quadrant.angleUpper() - borderOffset);

      // ensure that nodes never leave the radar
      thing.polar.r = Math.min(thing.polar.r, Radar.radius);

      // "save" the modifed polar coordinates back to x,y.
      thing.updateXY();
    }

    var origin = this.width / 2;

    this.svg.selectAll("circle.thing")
      .attr("cx", thing => this.transformx(thing.x))
      .attr("cy", thing => this.transformy(thing.y));

    this.svg.selectAll("text.thing")
      .attr("x", thing => this.transformx(thing.x))
      .attr("y", thing => this.transformy(thing.y))
      .text(thing => thing.name + " (" + thing.goodness().toPrecision(2) + ")");
  }

  private drawBackground() {

    // x axis
    this.svg.append("line")
      .attr("x1", this.transformx(0))
      .attr("y1", this.transformy(Radar.radius))
      .attr("x2", this.transformx(0))
      .attr("y2", this.transformy(-Radar.radius)) 
      .attr("stroke", "black")
      .attr("stoke-width", 1);

    // y axis
    this.svg.append("line")
      .attr("x1", this.transformx(Radar.radius))
      .attr("y1", this.transformy(0))
      .attr("x2", this.transformx(-Radar.radius))
      .attr("y2", this.transformy(0)) 
      .attr("stroke", "black")
      .attr("stoke-width", 1);

    this.svg.append("circle")
      .attr("cx", this.transformx(0))
      .attr("cy", this.transformy(0))
      .attr("r", this.scale(Radar.radius / 2))
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("fill", "none");
  }

  public addThing(thing: Thing) {
    this.things.push(thing);
  }

  // restart the force animation. re-call this every time you add one or
  // more Things to the radar  .
  public restart() {

    var circles = this.svg.selectAll("circle.thing")
        .data(this.things);
    
    // the enter set; no special animation; create sub-elements upon creation
    var enter = circles.enter().append("circle");
    
    enter
      .attr("class", "thing")
      .attr("r", 10)
      .attr("fill", "#3366ff")
      .call(this.force.drag);

    var texts = this.svg.selectAll("text.thing")
      .data(this.things)
      .enter()
      .append("text")
      .attr("class", "thing")
      .attr("dx", (thing: Thing) => thing.quadrant.isLeft() ? 20 : -20)
      .attr("dy", 5)
      .attr("text-anchor", (thing: Thing) => thing.quadrant.isLeft() ? "start" : "end")
    
    this.force.start();
  }
}

$(function() {
  

  var things = [
    new Thing("C++",        Quadrant.Languages, 0.9),
    new Thing("Scala",      Quadrant.Languages, 0.6),
    new Thing("TypeScript", Quadrant.Languages, 0.7),
    new Thing("C#",         Quadrant.Languages, 0.1),
    new Thing("APL",        Quadrant.Languages, 0.8),
    new Thing("Continuous Integration", Quadrant.Techniques, 0.8),
    new Thing("CodeSourcery GCC", Quadrant.Platforms, 0.5),
    new Thing("NCrunch", Quadrant.Tools, 0.5),
    new Thing("Git", Quadrant.Tools, 0.6),
  ];

  var radar = new Radar(400);
  for (var i = 0; i != things.length; i++) {
    radar.addThing(things[i]);
  }
  radar.restart();
});