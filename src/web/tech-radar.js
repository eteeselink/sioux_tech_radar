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
    }
    return Thing;
})();
var Viewport = (function () {
    function Viewport(width, xOrigin, yOrigin) {
        this.width = width;
        this.xOrigin = xOrigin;
        this.yOrigin = yOrigin;
        this.svg = d3.select("body").append("svg").attr("width", $(document).width()).attr("height", width).style("transform", "translate(" + xOrigin + ", " + yOrigin + ")").style("border", "1px 1px 0 0 solid black");
    }
    Viewport.prototype.draw = function (things) {
        var self = this;
        var circles = this.svg.selectAll("g").data(things);
        var enter = circles.enter().append("g").attr("x", function (thing) {
            return thing.goodness * self.width;
        }).attr("y", function (thing) {
            return thing.goodness * self.width;
        });
        enter.append("circle").attr("r", 10).attr("fill", "#3366ff");
        console.log(circles);
    };
    return Viewport;
})();
$(function () {
    var things = [
        new Thing("C++", Quadrant.Languages, 0.9), 
        new Thing("TypeScript", Quadrant.Languages, 0.7), 
        new Thing("C#", Quadrant.Languages, 0.8), 
        new Thing("APL", Quadrant.Languages, 0.8), 
        new Thing("Scala", Quadrant.Languages, 0.6), 
        new Thing("Continuous Integration", Quadrant.Techniques, 0.8), 
        
    ];
    var canvas = new Viewport(400, $(document).width() / 2, 200);
    canvas.draw(things);
});
