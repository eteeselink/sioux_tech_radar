// Definitions from https://github.com/borisyankov/DefinitelyTyped
/// <reference path="jquery-1.8.d.ts" />
/// <reference path="d3-2.10.d.ts" />

var deg45 = Math.PI / 4;

class Quadrant {
  constructor(public angle: number) {}

  public static Tools      = new Quadrant(1 * deg45);
  public static Techniques = new Quadrant(3 * deg45);
  public static Platforms  = new Quadrant(5 * deg45);
  public static Languages  = new Quadrant(7 * deg45);
}
  


class Thing {
  constructor(
    public name: string, 
    public quadrant: Quadrant, 
    public goodness: number,   // between 0.0 and 1.0; closer to zero is better
  ) { }
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
      .style("transform", "translate(" + xOrigin + ", " + yOrigin + ")")
      .style("border", "1px 1px 0 0 solid black");
  }
  
  public svg: ID3Selection;
  //public g: ID3Selection;
  
  public draw(things: Thing[]) {
    var self = this;
    var circles = this.svg.selectAll("g")
        .data(things);
    
    // enter
    var enter = circles.enter().append("g")
      .attr("x", function(thing) { return thing.goodness * self.width; })
      .attr("y", function(thing) { return thing.goodness * self.width; });
    
    enter.append("circle")
      .attr("r", 10)
      .attr("fill", "#3366ff");

    
    console.log(circles);
  }
}

$(function() {

  var things = [
    new Thing("C++",        Quadrant.Languages, 0.9),
    new Thing("TypeScript", Quadrant.Languages, 0.7),
    new Thing("C#",         Quadrant.Languages, 0.8),
    new Thing("APL",        Quadrant.Languages, 0.8),
    new Thing("Scala",      Quadrant.Languages, 0.6),
    new Thing("Continuous Integration", Quadrant.Techniques, 0.8),
    //new Thing("CodeSourcery GCC", Quadrant.Platforms, 0.5),
    //new Thing("NCrunch", Quadrant.Tools, 0.5),
    //new Thing("Git", Quadrant.Tools, 0.6),
  ];

  var canvas = new Viewport(400, $(document).width() / 2, 200);
  canvas.draw(things);
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
