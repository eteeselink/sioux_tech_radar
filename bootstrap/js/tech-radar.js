var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
var D3Node = (function () {
    function D3Node(x, y) {
        this.x = x;
        this.y = y;
    }
    return D3Node;
})();
var D3Link = (function () {
    function D3Link(source, target) {
        this.source = source;
        this.target = target;
    }
    return D3Link;
})();
var Thing = (function (_super) {
    __extends(Thing, _super);
    function Thing(name, quadrant, goodness) {
        _super.call(this, goodness * Math.SQRT2 + (Math.random() * 0.002 - 0.001), goodness * Math.SQRT2 + (Math.random() * 0.002 - 0.001));
        this.name = name;
        this.quadrant = quadrant;
        this.goodness = goodness;
    }
    return Thing;
})(D3Node);
var Viewport = (function () {
    function Viewport(width, xOrigin, yOrigin) {
        this.width = width;
        this.xOrigin = xOrigin;
        this.yOrigin = yOrigin;
        var _this = this;
        this.svg = d3.select("body").append("svg").attr("width", $(document).width()).attr("height", width).style("border", "1px 1px 0 0 solid black");
        this.origin = new D3Node(0, 0);
        this.force = d3.layout.force().nodes([
            this.origin
        ]).size([
            1, 
            1
        ]).gravity(0).linkDistance(function (link) {
            return link.target.goodness * 1;
        }).linkStrength(1).charge(function (node) {
            return (node instanceof Thing) ? 0 : 0;
        }).on("tick", function () {
            return _this.tick();
        });
        this.nodes = this.force.nodes();
        this.things = [];
        this.links = this.force.links();
    }
    Viewport.prototype.tick = function () {
        var self = this;
        this.svg.selectAll("g").attr("transform", function (thing) {
            return "translate(" + thing.x * self.width + ", " + thing.y * self.width + ")";
        });
    };
    Viewport.prototype.addThing = function (thing) {
        this.things.push(thing);
        this.nodes.push(thing);
        this.links.push(new D3Link(this.origin, thing));
    };
    Viewport.prototype.restart = function () {
        var origin = this.svg.selectAll("circle").data([
            this.origin
        ]);
        origin.enter().append("circle").attr("class", "origin").attr("cx", function (o) {
            return o.x;
        }).attr("cy", function (o) {
            return o.y;
        }).attr("r", 5).attr("fill", "#000");
        var circles = this.svg.selectAll("g").data(this.things);
        var enter = circles.enter().append("g");
        enter.append("circle").attr("r", 10).attr("fill", "#3366ff");
        enter.append("text").attr("dx", 20).attr("dy", 5).text(function (thing) {
            return thing.name;
        });
        this.force.start();
        this.force.alpha(0.01);
    };
    return Viewport;
})();
$(function () {
    var things = [
        new Thing("C++", Quadrant.Languages, 0.9), 
        new Thing("TypeScript", Quadrant.Languages, 0.7), 
        new Thing("C#", Quadrant.Languages, 0.1), 
        new Thing("APL", Quadrant.Languages, 0.8), 
        new Thing("Scala", Quadrant.Languages, 0.6), 
        
    ];
    var canvas = new Viewport(400, $(document).width() / 2, 200);
    for(var i = 0; i != things.length; i++) {
        canvas.addThing(things[i]);
    }
    canvas.restart();
});
