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
    function Thing(name, quadrant, goodness, scale) {
        _super.call(this, null, null);
        this.name = name;
        this.quadrant = quadrant;
        this.scale = scale;
        var polar = new Polar(goodness * scale, Math.random() * Math.PI * 0.5 + Math.PI * 1.5);
        this.x = polar.x();
        this.y = polar.y();
    }
    Thing.prototype.goodness = function () {
        var polar = Polar.fromPoint(this.x, this.y);
        return polar.r / this.scale;
    };
    return Thing;
})(D3Node);
var Polar = (function () {
    function Polar(r, phi) {
        this.r = r;
        this.phi = phi;
    }
    Polar.fromPoint = function fromPoint(x, y) {
        y = -y;
        return new Polar(Math.sqrt(x * x + y * y), Math.atan2(y, x));
    }
    Polar.prototype.x = function () {
        return this.r * Math.cos(this.phi);
    };
    Polar.prototype.y = function () {
        return -this.r * Math.sin(this.phi);
    };
    return Polar;
})();
var Viewport = (function () {
    function Viewport(width) {
        this.width = width;
        var _this = this;
        this.svg = d3.select("body").append("svg").attr("width", width * 1.5).attr("height", width).style("border", "1px solid black");
        this.force = d3.layout.force().nodes([]).size([
            this.width, 
            this.width
        ]).gravity(0.005).on("tick", function () {
            return _this.tick();
        });
        this.things = this.force.nodes();
    }
    Viewport.prototype.tick = function () {
        for(var i = 0; i != this.things.length; i++) {
            var thing = this.things[i];
            var prev = Polar.fromPoint(thing.px, thing.py);
            var cur = Polar.fromPoint(thing.x, thing.y);
            var r = prev.r;
            var sens = this.width / 100;
            r = Math.round(r / sens) * sens;
            var next = new Polar(r, cur.phi);
            thing.x = next.x();
            thing.y = next.y();
        }
        var origin = this.width / 2;
        this.svg.selectAll("circle").attr("cx", function (thing) {
            return thing.x + origin;
        }).attr("cy", function (thing) {
            return thing.y + origin;
        });
        this.svg.selectAll("text").attr("x", function (thing) {
            return thing.x + origin;
        }).attr("y", function (thing) {
            return thing.y + origin;
        }).text(function (thing) {
            return thing.name + " (" + thing.goodness().toPrecision(2) + ")";
        });
    };
    Viewport.prototype.addThing = function (thing) {
        this.things.push(thing);
    };
    Viewport.prototype.restart = function () {
        var circles = this.svg.selectAll("circle").data(this.things);
        var enter = circles.enter().append("circle");
        enter.attr("r", 10).attr("fill", "#3366ff").call(this.force.drag);
        var texts = this.svg.selectAll("text").data(this.things).enter().append("text").attr("dx", 20).attr("dy", 5);
        this.force.start();
    };
    return Viewport;
})();
$(function () {
    var width = 200;
    var things = [
        new Thing("C++", Quadrant.Languages, 0.9, width), 
        new Thing("Scala", Quadrant.Languages, 0.6, width), 
        new Thing("TypeScript", Quadrant.Languages, 0.7, width), 
        new Thing("C#", Quadrant.Languages, 0.1, width), 
        new Thing("APL", Quadrant.Languages, 0.8, width), 
        
    ];
    var canvas = new Viewport(width * 2);
    for(var i = 0; i != things.length; i++) {
        canvas.addThing(things[i]);
    }
    canvas.restart();
});
