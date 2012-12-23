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
}

class D3Link {
  constructor(public source: D3Node, public target: D3Node) { }
}


class Thing extends D3Node {
  constructor(
    public name: string, 
    public quadrant: Quadrant, 
    public goodness: number,   // between 0.0 and 1.0; closer to zero is better
  ) {
    //var xy = ;
    super(goodness * Math.SQRT2 + (Math.random() * 0.002 - 0.001), goodness * Math.SQRT2 + (Math.random() * 0.002 - 0.001));
   }
}


class Viewport {
  constructor(
    public width: number,
    public xOrigin: number,
    public yOrigin: number,
  ) {
    this.svg = d3.select("body").append("svg")
      .attr("width", $(document).width())
      .attr("height", width)
     // .style("transform", "translate(" + xOrigin + ", " + yOrigin + ")")
      .style("border", "1px 1px 0 0 solid black");

    this.origin = new D3Node(0, 0);

    this.force = d3.layout.force()
      .nodes([this.origin])
      //.size([this.width, this.width])
      .size([1,1])
      .gravity(0)
      .linkDistance(link => link.target.goodness * 1)
      .linkStrength(1)
      .charge(node => (node instanceof Thing) ? 0  : 0)
      .on("tick", () => this.tick());

    this.nodes = this.force.nodes();
    this.things = [];
    this.links = this.force.links();
  }
  
  public svg: any;
  
  public force: any;
  public origin: D3Node;
  public things: Thing[];
  public nodes: D3Node[];
  public links: D3Link[];
  
  public tick() {
    var self = this;
    
    this.svg.selectAll("g")
      .attr("transform", function (thing) {
        //console.log([thing.name, thing.x, thing.y]);
        return "translate(" + thing.x * self.width + ", " + thing.y * self.width + ")";
      })
  }

  public addThing(thing: Thing) {
    this.things.push(thing);
    this.nodes.push(thing);
    this.links.push(new D3Link(this.origin, thing));
  }

  
  public restart() {

    var origin = this.svg.selectAll("circle")
        .data([this.origin]);

    origin.enter()
      .append("circle")
      .attr("class", "origin")
      .attr("cx", o => o.x)
      .attr("cy", o => o.y)
      .attr("r", 5)
      .attr("fill", "#000");

    var circles = this.svg.selectAll("g")
        .data(this.things);
    
    // enter; no special animation; create sub-elements upon creation
    var enter = circles.enter().append("g");
    
    enter.append("circle")
      .attr("r", 10)
      .attr("fill", "#3366ff");
      //.call(d3.behavior.drag().on("drag", move));

    enter.append("text")
      .attr("dx", 20)
      .attr("dy", 5)
      .text(thing => thing.name);  
    
    
    this.force.start();
    this.force.alpha(0.01);
  }
}

//function move(){
//    this.parentNode.appendChild(this);
//    var dragTarget = d3.select(this);
//    dragTarget
//        .attr("cx", function(){return d3.event.dx + parseInt(dragTarget.attr("cx"))})
//        .attr("cy", function(){return d3.event.dy + parseInt(dragTarget.attr("cy"))});
//};

$(function() {

  var things = [
    new Thing("C++",        Quadrant.Languages, 0.9),
    new Thing("TypeScript", Quadrant.Languages, 0.7),
    new Thing("C#",         Quadrant.Languages, 0.1),
    new Thing("APL",        Quadrant.Languages, 0.8),
    new Thing("Scala",      Quadrant.Languages, 0.6),
    //new Thing("Continuous Integration", Quadrant.Techniques, 0.8),
    //new Thing("CodeSourcery GCC", Quadrant.Platforms, 0.5),
    //new Thing("NCrunch", Quadrant.Tools, 0.5),
    //new Thing("Git", Quadrant.Tools, 0.6),
  ];

  var canvas = new Viewport(400, $(document).width() / 2, 200);
  for (var i = 0; i != things.length; i++) {
    canvas.addThing(things[i]);
  }
  canvas.restart();
});

//
//class Thing {
//  constructor(
//    public name: string, 
//    public quadrant: Quadrant, 
//    public goodness: number,
//  ) { 
//    var badness = 1.0 - this.goodness;
//    this.x =  badness * Math.cos(this.quadrant.angle);
//    this.y = -badness * Math.sin(this.quadrant.angle);
//  }
//  
//  public x: number;
//  public y: number;
//}
//
//
//class Canvas {
//
//  constructor(
//    public width:   number, 
//    public height:  number, 
//    public xOrigin: number, 
//    public yOrigin: number, 
//    public things:  Thing[],
//  ) { }
//  
//  public draw() {
//  
//    var thingDots = d3.select("#radar-plot")
//                   .selectAll("div.thing")
//                   .data(this.things);
//    
//    this.setThings(thingDots);
//    
//    this.setThings(thingDots.enter().append("div.thing"));
//      
//    thingDots.exit().remove();
//    
//    var origin = d3.select("#radar-plot")
//                 .selectAll("div.origin")
//                 .data([0]);
//    
//    this.setOrigin(origin.enter().append("div"));
//  }
//  
//  private setOrigin(origin: ID3Selection) {
//    origin
//      .classed("origin", true)
//      .style("left", (this.xOrigin - 10) + "px")
//      .style("top",  (this.yOrigin - 10) + "px")
//      .style("width", 20 + "px")
//      .style("height", 20 + "px");
//  }
//  
//  private setThings(thingDots: ID3Selection) {
//  
//    var self = this;
//    thingDots
//      .classed("thing", true)
//      .text(function(thing) { return thing.name; })
//      .style("position", "absolute")
//      .style("left", function(thing: Thing) { return Math.round(thing.x * self.width / 2  + self.xOrigin) + "px"; })
//      .style("top",  function(thing: Thing) { return Math.round(thing.y * self.height / 2 + self.yOrigin) + "px"; });
//  }
//}
//
//
