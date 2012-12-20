var deg45 = Math.PI / 4;
var Quadrant = (function () {
    function Quadrant(angle) {
        this.angle = angle;
    }
    Quadrant.Tools = new Quadrant(1 * deg45);
    Quadrant.Techniques = new Quadrant(3 * deg45);
    Quadrant.Platforms = new Quadrant(5 * deg45);
    Quadrant.Languages = new Quadrant(7 * deg45);
    return Quadrant;
})();
var Thing = (function () {
    function Thing(name, quadrant, goodness) {
        this.name = name;
        this.quadrant = quadrant;
        this.goodness = goodness;
        var badness = 1.0 - this.goodness;
        this.x = badness * Math.cos(this.quadrant.angle);
        this.y = -badness * Math.sin(this.quadrant.angle);
    }
    return Thing;
})();
var Canvas = (function () {
    function Canvas(width, height, xOrigin, yOrigin, things) {
        this.width = width;
        this.height = height;
        this.xOrigin = xOrigin;
        this.yOrigin = yOrigin;
        this.things = things;
    }
    Canvas.prototype.draw = function () {
        var thingDots = d3.select("#radar-plot").selectAll("div.thing").data(this.things);
        this.setThings(thingDots);
        this.setThings(thingDots.enter().append("div.thing"));
        thingDots.exit().remove();
        var origin = d3.select("#radar-plot").selectAll("div.origin").data([
            0
        ]);
        this.setOrigin(origin.enter().append("div"));
    };
    Canvas.prototype.setOrigin = function (origin) {
        origin.classed("origin", true).style("left", (this.xOrigin - 10) + "px").style("top", (this.yOrigin - 10) + "px").style("width", 20 + "px").style("height", 20 + "px");
    };
    Canvas.prototype.setThings = function (thingDots) {
        var self = this;
        thingDots.classed("thing", true).text(function (thing) {
            return thing.name;
        }).style("position", "absolute").style("left", function (thing) {
            return Math.round(thing.x * self.width / 2 + self.xOrigin) + "px";
        }).style("top", function (thing) {
            return Math.round(thing.y * self.height / 2 + self.yOrigin) + "px";
        });
    };
    return Canvas;
})();
$(function () {
    var thingData = [
        new Thing("C++", Quadrant.Languages, 0.1), 
        new Thing("TypeScript", Quadrant.Languages, 0.3), 
        new Thing("C#", Quadrant.Languages, 0.9), 
        new Thing("Continuous Integration", Quadrant.Techniques, 0.8), 
        new Thing("CodeSourcery GCC", Quadrant.Platforms, 0.5), 
        new Thing("NCrunch", Quadrant.Tools, 0.5), 
        new Thing("Git", Quadrant.Tools, 0.6), 
        
    ];
    var canvas = new Canvas(600, 600, $(document).width() / 2, 300, thingData);
    canvas.draw();
});
