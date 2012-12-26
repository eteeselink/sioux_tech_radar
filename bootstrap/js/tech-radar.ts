/// <reference path="structs.ts" />
/// <reference path="view-model.ts" />

declare var d3: any;

 
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

  /// @param diameter the diameter (in pixels) of the generated radar. the SVG
  /// element generated will be double as wide and slightly higher.
  /// @param quadrant (optional) the quadrant to display. To display the entire radar,
  /// pass `null`.
  constructor(
    private diameter: number,
    private quadrant: Quadrant,
    auxClasses: string,
  ) {
    // a margin, where necessary, to accommodate for the ends of the axes
    // as well as parts of dots places near axes. specified in a factor of the
    // entire radar diameter.
    var margin = 1.1; // 10% margin

    this.createSvg(auxClasses, margin)
    this.drawBackground(margin);
    this.setupForceLayout();
  }

  /// Call this to add more models to the view. 
  public addThings(things: Thing[]) {
    things.forEach(thing => this.things.push(thing));
    this.restart();
  }

  private createSvg(auxClasses: string, margin: number) {

    // single quadrant: make the svg 1.5x wider that specified to accommodate
    // for text labels
    // all quadrants: make the svg 2x wider for the same reason, making space
    // for text labels in both directions.
    var svg = d3.select("body").append("svg")
      .attr("class", "radar " + auxClasses)
      .attr("width",  this.diameter * (this.quadrant ? 1.5    : 2))
      .attr("height", this.diameter * (this.quadrant ? margin : (margin * 2 - 1)));

    // set up a global SVG transformation from internal coordinate system
    // to whatever `this.diameter` has been set to.
    if (this.quadrant) {
      var scale      = this.diameter / Radar.radius; 
      var translatex = this.quadrant.isLeft() ? Radar.radius * 1.5    : 0;
      var translatey = this.quadrant.isTop()  ? Radar.radius * margin : 0;
    } else {
      var scale      = this.diameter / (Radar.radius * 2); 
      var translatex = Radar.radius * 2;
      var translatey = Radar.radius * margin;
    }

    // you can't put a transform on the svg element itself, so we simply put all
    // svg elements in a global group node that has the transform.
    this.svg = svg.append("g")
      .attr("transform", "scale(" + scale + ") translate(" + translatex + ", " + translatey +")");

  }

  /// Draw the main SVG tag and the static background lines.
  private drawBackground(axisLengthFactor) {

    this.drawLabeledCircle("Doen!",          0.47, Radar.radius * 0.4);
    this.drawLabeledCircle("Proberen",       0.40, Radar.radius * 0.7);
    this.drawCenteredCircle(Radar.radius * 0.85);
    this.drawLabeledCircle("Experimenteren", 0.53, Radar.radius * 0.86);
    this.drawLabeledCircle("Afblijven",      0.27, Radar.radius * 1.0);

    
    var axislen = Radar.radius * axisLengthFactor;

    // x axis
    this.drawLine(0, axislen, 0, -axislen);

    // y axis
    this.drawLine(axislen, 0, -axislen, 0);

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
    this.svg.selectAll("text.thing")
      .data(this.things)
      .enter()
      .append("text")
      .attr("class", "thing")
      .attr("dx", (thing: Thing) => (thing.quadrant.isLeft() ? -1 : 1) * 12)
      .attr("dy", 4)
      .attr("text-anchor", (thing: Thing) => thing.quadrant.isLeft() ? "end" : "start")
      .text((thing: Thing) => thing.name);
    
    circles.enter().append("circle")
      .attr("class", "thing")
      .attr("r", 4)
      .call(this.force.drag);

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

    var origin = this.diameter / 2;

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

  private drawLabeledCircle(name: string, arcWidth: number, r: number) {

    var quadrant = this.quadrant || Quadrant.Tools;

    this.drawCenteredCircle(r);

    if (quadrant.isTop()) {
      var middleAngle = 0;
    } else {
      var middleAngle = Math.PI;
      arcWidth = -arcWidth;
    }

    if (quadrant.isLeft()) {
      var startAngle = middleAngle - arcWidth;
      var endAngle = middleAngle;
    } else {
      var startAngle = middleAngle;
      var endAngle = middleAngle + arcWidth;
    }

    if (!quadrant.isTop()) {
      var h = endAngle;
      endAngle = startAngle;
      startAngle = h;
    }

    var arc = d3.svg.arc()
      .innerRadius(r - 0.02 * Radar.radius)
      .outerRadius(r + 0.02 * Radar.radius)
      .startAngle(startAngle)
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
      .attr("startOffset", quadrant.isTop() ? "0%" : "50%")
      .append("tspan")
      .attr("dy", 8)
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
