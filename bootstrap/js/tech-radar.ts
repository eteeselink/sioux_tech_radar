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
  /// the distance from the origin to each of the four edges
  /// i.e. the radar's radius. hard-coded to 200 because some of the
  /// force layout's constants depend on it
  public static radius = 200;

  private svg: any;
  private force: any;
  private things: Thing[];
  private static quadrantGravity = 0.03;

  constructor(
    private width: number,
  ) {

    //// create transforms and other plot-related constants

    var ymargin = 10;

    this.drawBackground(ymargin);
    this.setupForceLayout();
  }

  /// Call this to add more models to the view. 
  public addThings(things: Thing[]) {
    things.forEach(thing => this.things.push(thing));
    this.restart();
  }

  /// Draw the main SVG tag and the static background lines.
  private drawBackground(ymargin: number) {

    var halfWidth = this.width / 2;
    var translatex = Radar.radius * 2;
    var translatey = Radar.radius + ymargin;
    var scale = this.width / (Radar.radius * 2);

    this.svg = d3.select("body").append("svg")
      .attr("class", "radar")
      .attr("width", this.width * 2)
      .attr("height", this.width + ymargin * 2)
      .append("g")
      .attr("transform", "scale(" + scale + ") translate(" + translatex + ", " + translatey +")");

    //this.drawCenteredCircle(Radar.radius * 0.7);
    this.drawLabeledCircle("Doen!",          0.53, Radar.radius * 0.4);
    this.drawLabeledCircle("Proberen",       0.44, Radar.radius * 0.7);
    this.drawCenteredCircle(Radar.radius * 0.85);
    this.drawLabeledCircle("Experimenteren", 0.60, Radar.radius * 0.86);
    this.drawLabeledCircle("Afblijven",      0.30, Radar.radius * 1.0);

    

    // x axis
    this.drawLine(0, Radar.radius * 1.1, 0, -Radar.radius * 1.1);

    // y axis
    this.drawLine(Radar.radius * 1.1, 0, -Radar.radius * 1.1, 0);

  }

  /// Creates a d3 force layout with unlinked nodes that repel each other and
  /// no gravitational force towards the centre of the diagram
  /// Additional forces are added in the `tick` method.
  private setupForceLayout() {
    this.force = d3.layout.force()
      .nodes([])
      .size([Radar.radius * 2, Radar.radius * 2])
      .gravity(0)
      .charge(-50)
      .on("tick", e => this.tick(e));

    this.things = <Thing[]>this.force.nodes();
  }

  /// Restart the force animation. Must be re-called every time the model (i.e.
  /// `this.things` changes.
  private restart() {

    var circles = this.svg.selectAll("circle.thing")
        .data(this.things);
    
    // the enter set; no special animation; create sub-elements upon creation
    var enter = circles.enter().append("circle");
    
    enter
      .attr("class", "thing")
      .attr("r", 6)
      .call(this.force.drag);

    var texts = this.svg.selectAll("text.thing")
      .data(this.things)
      .enter()
      .append("text")
      .attr("class", "thing")
      .attr("dx", (thing: Thing) => (thing.quadrant.isLeft() ? 1 : -1) * 12)
      .attr("dy", 4)
      .attr("text-anchor", (thing: Thing) => thing.quadrant.isLeft() ? "start" : "end")
      .text((thing: Thing) => thing.name);
    
    this.force.start();
  }


  private tick(e: any) {
    
    // change every node's newly computed position such that
    // the distance from the origin (r) never changes, and only 
    // its angle (phi) can.
    this.things.forEach(thing => {

      // "read" the newly computed x,y values into `thing.polar`.
      thing.updatePolar();

      // set the thing's radius to whatever it was, unless we're being dragged
      thing.fixRadius();

      // enable "quadrant gravity", pulling each node a bit to the centre diagonal
      // of its quadrant
      thing.polar.phi += (thing.quadrant.angle - thing.polar.phi) * e.alpha * Radar.quadrantGravity;

      var borderOffset = 10 / (thing.polar.r + 0.1);
      // ensure that nodes never leave their quadrant
      thing.polar.phi = cap(thing.quadrant.angleLower() + borderOffset, thing.polar.phi, thing.quadrant.angleUpper() - borderOffset);

      // ensure that nodes never leave the radar
      thing.polar.r = Math.min(thing.polar.r, Radar.radius);

      // "save" the modifed polar coordinates back to x,y.
      thing.updateXY();
    });

    var origin = this.width / 2;

    this.svg.selectAll("circle.thing")
      .attr("cx", thing => thing.x)
      .attr("cy", thing => thing.y);

    this.svg.selectAll("text.thing")
      .attr("x", thing => thing.x)
      .attr("y", thing => thing.y);
      //.text(thing => thing.name + " (" + thing.goodness().toPrecision(2) + ")");
  }

  private drawLine(x1: number, y1: number, x2: number, y2: number) {
    this.svg.append("line")
      .attr("class", "lines")
      .attr("x1", x1)
      .attr("y1", y1)
      .attr("x2", x2)
      .attr("y2", y2);
  }

  private drawLabeledCircle(name: string, endAngle: number, r: number) {

    this.drawCenteredCircle(r);

    var arc = d3.svg.arc()
      .innerRadius(r - 0.02 * Radar.radius)
      .outerRadius(r + 0.02 * Radar.radius)
      .startAngle(0)
      .endAngle(endAngle);

    var id = name.replace(/[^a-z]/, "");
    this.svg.append("path")
      .attr("d", arc)
      .attr("id", id)
      .style("stroke", "none")
      .style("fill", "white");

    this.svg.append("text")
      .append("textPath")
      .attr("xlink:href", "#" + id)
      .append("tspan")
      .attr("dy", 10)
      .attr("dx", 5)
      .text(name);
  }

  private drawCenteredCircle(r: number) {
    this.svg.append("circle")
      .attr("class", "lines")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", r)
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

  var q = [Quadrant.Languages, Quadrant.Platforms, Quadrant.Techniques, Quadrant.Tools];

  d3.range(60).forEach(i => things.push(new Thing(i.toString(), q[i % 4], random(0.1, 1.0))));

  var radar = new Radar(500);

  radar.addThings(things);
});