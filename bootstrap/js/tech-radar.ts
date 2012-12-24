// Definitions from https://github.com/borisyankov/DefinitelyTyped
/// <reference path="jquery-1.8.d.ts" />
/// // <reference path="d3-2.10.d.ts" />

declare var d3: any;

var deg45 = Math.PI / 4;

class Quadrant {
  constructor(public angle: number) {}

  public static Tools      = new Quadrant(1 * deg45);
  public static Techniques = new Quadrant(3 * deg45);
  public static Platforms  = new Quadrant(5 * deg45);
  public static Languages  = new Quadrant(7 * deg45);
}

class D3Node {
  constructor(public x: number, public y: number) { }  
  public px: number;
  public py: number;
}

class D3Link {
  constructor(public source: D3Node, public target: D3Node) { }
}


class Thing extends D3Node {
  constructor(
    public name: string, 
    public quadrant: Quadrant, 
    goodness: number,   // between 0.0 and 1.0; closer to zero is better
    private scale: number,
  ) {
    super(null, null);
    var polar = new Polar(goodness * scale, Math.random() * Math.PI * 0.5 + Math.PI * 1.5);
    this.x = polar.x();
    this.y = polar.y();
   }

  public goodness() {
    var polar = Polar.fromPoint(this.x, this.y);
    return polar.r / this.scale;
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


class Viewport {
  constructor(
    private width: number,
  ) {
    this.svg = d3.select("body").append("svg")
      .attr("width", width * 1.5)
      .attr("height", width)
      .style("border", "1px solid black");

    this.force = d3.layout.force()
      .nodes([])
      .size([this.width, this.width])
      .gravity(0.005)
      .on("tick", () => this.tick());

    this.things = <Thing[]>this.force.nodes();
  }

  private svg: any;
  private force: any;
  private things: Thing[];
  
  private tick() {
    
    // change every node's newly computed position such that
    // the distance from the origin (r) never changes, and only 
    // its angle (phi) can.
    for (var i = 0; i != this.things.length; i++) {
      var thing = this.things[i];
      var prev = Polar.fromPoint(thing.px, thing.py);
      var cur  = Polar.fromPoint(thing.x, thing.y);
      var r = prev.r;
      var sens = this.width / 100;
      r = Math.round(r / sens) * sens;
      var next = new Polar(r, cur.phi);

      thing.x = next.x();
      thing.y = next.y();
    }

    var origin = this.width / 2;

    this.svg.selectAll("circle")
      .attr("cx", thing => thing.x + origin)
      .attr("cy", thing => thing.y + origin);

    this.svg.selectAll("text")
      .attr("x", thing => thing.x + origin)
      .attr("y", thing => thing.y + origin)
      .text(thing => thing.name + " (" + thing.goodness().toPrecision(2) + ")");
  }

  public addThing(thing: Thing) {
    this.things.push(thing);
  }

  
  public restart() {

    var circles = this.svg.selectAll("circle")
        .data(this.things);
    
    // enter; no special animation; create sub-elements upon creation
    var enter = circles.enter().append("circle");
    
    
    enter
      .attr("r", 10)
      .attr("fill", "#3366ff")
      .call(this.force.drag);

    var texts = this.svg.selectAll("text")
      .data(this.things)
      .enter()
      .append("text")
      .attr("dx", 20)
      .attr("dy", 5)
    
    this.force.start();
  }
}

$(function() {
  var width = 200;

  var things = [
    new Thing("C++",        Quadrant.Languages, 0.9, width),
    new Thing("Scala",      Quadrant.Languages, 0.6, width),
    new Thing("TypeScript", Quadrant.Languages, 0.7, width),
    new Thing("C#",         Quadrant.Languages, 0.1, width),
    new Thing("APL",        Quadrant.Languages, 0.8, width),
    //new Thing("Continuous Integration", Quadrant.Techniques, 0.8),
    //new Thing("CodeSourcery GCC", Quadrant.Platforms, 0.5),
    //new Thing("NCrunch", Quadrant.Tools, 0.5),
    //new Thing("Git", Quadrant.Tools, 0.6),
  ];

  var canvas = new Viewport(width * 2);
  for (var i = 0; i != things.length; i++) {
    canvas.addThing(things[i]);
  }
  canvas.restart();
});