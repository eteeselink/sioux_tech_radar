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
    Quadrant.Platforms = new Quadrant(-3 * deg45);
    Quadrant.Languages = new Quadrant(-1 * deg45);
    Quadrant.prototype.angleLower = function () {
        return this.angle - deg45;
    };
    Quadrant.prototype.angleUpper = function () {
        return this.angle + deg45;
    };
    Quadrant.prototype.isLeft = function () {
        return Math.abs(this.angle) < (Math.PI / 2);
    };
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
        _super.call(this, null, null);
        this.name = name;
        this.quadrant = quadrant;
        var r = goodness * Radar.radius;
        var phi = random(quadrant.angleLower(), quadrant.angleUpper());
        this.polar = new Polar(r, phi);
        this.updateXY();
    }
    Thing.prototype.updatePolar = function () {
        this.prevPolar = this.polar;
        this.polar = Polar.fromPoint(this.x, this.y);
    };
    Thing.prototype.fixRadius = function () {
        if(!this.isBeingDragged()) {
            this.polar.r = this.prevPolar.r;
        }
    };
    Thing.prototype.updateXY = function () {
        this.x = this.polar.x();
        this.y = this.polar.y();
    };
    Thing.prototype.isBeingDragged = function () {
        return this.fixed & 2;
    };
    Thing.prototype.goodness = function () {
        return this.polar.r / Radar.radius;
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
function random(from, to) {
    var domain = to - from;
    return Math.random() * domain + from;
}
function cap(lowerBound, value, upperBound) {
    return Math.max(lowerBound, Math.min(upperBound, value));
}
var Radar = (function () {
    function Radar(width) {
        this.width = width;
        var _this = this;
        this.quadrantGravity = 0.03;
        var halfWidth = this.width / 2;
        this.transformx = d3.scale.linear().domain([
            -Radar.radius, 
            Radar.radius
        ]).range([
            halfWidth, 
            3 * halfWidth
        ]);
        this.transformy = d3.scale.linear().domain([
            -Radar.radius, 
            Radar.radius
        ]).range([
            0, 
            this.width
        ]);
        this.scale = d3.scale.linear().domain([
            0, 
            Radar.radius * 2
        ]).range([
            0, 
            this.width
        ]);
        this.svg = d3.select("body").append("svg").attr("width", width * 2).attr("height", width);
        this.drawBackground();
        this.force = d3.layout.force().nodes([]).size([
            Radar.radius * 2, 
            Radar.radius * 2
        ]).gravity(0).charge(-100).on("tick", function (e) {
            return _this.tick(e);
        });
        this.things = this.force.nodes();
    }
    Radar.radius = 200;
    Radar.prototype.tick = function (e) {
        var _this = this;
        for(var i = 0; i != this.things.length; i++) {
            var thing = this.things[i];
            thing.updatePolar();
            thing.fixRadius();
            thing.polar.phi += (thing.quadrant.angle - thing.polar.phi) * e.alpha * this.quadrantGravity;
            var borderOffset = 10 / (thing.polar.r + 0.1);
            thing.polar.phi = cap(thing.quadrant.angleLower() + borderOffset, thing.polar.phi, thing.quadrant.angleUpper() - borderOffset);
            thing.polar.r = Math.min(thing.polar.r, Radar.radius);
            thing.updateXY();
        }
        var origin = this.width / 2;
        this.svg.selectAll("circle.thing").attr("cx", function (thing) {
            return _this.transformx(thing.x);
        }).attr("cy", function (thing) {
            return _this.transformy(thing.y);
        });
        this.svg.selectAll("text.thing").attr("x", function (thing) {
            return _this.transformx(thing.x);
        }).attr("y", function (thing) {
            return _this.transformy(thing.y);
        }).text(function (thing) {
            return thing.name + " (" + thing.goodness().toPrecision(2) + ")";
        });
    };
    Radar.prototype.drawBackground = function () {
        this.svg.append("line").attr("x1", this.transformx(0)).attr("y1", this.transformy(Radar.radius)).attr("x2", this.transformx(0)).attr("y2", this.transformy(-Radar.radius)).attr("stroke", "black").attr("stoke-width", 1);
        this.svg.append("line").attr("x1", this.transformx(Radar.radius)).attr("y1", this.transformy(0)).attr("x2", this.transformx(-Radar.radius)).attr("y2", this.transformy(0)).attr("stroke", "black").attr("stoke-width", 1);
        this.svg.append("circle").attr("cx", this.transformx(0)).attr("cy", this.transformy(0)).attr("r", this.scale(Radar.radius / 2)).attr("stroke", "black").attr("stroke-width", 1).attr("fill", "none");
    };
    Radar.prototype.addThing = function (thing) {
        this.things.push(thing);
    };
    Radar.prototype.restart = function () {
        var circles = this.svg.selectAll("circle.thing").data(this.things);
        var enter = circles.enter().append("circle");
        enter.attr("class", "thing").attr("r", 10).attr("fill", "#3366ff").call(this.force.drag);
        var texts = this.svg.selectAll("text.thing").data(this.things).enter().append("text").attr("class", "thing").attr("dx", function (thing) {
            return thing.quadrant.isLeft() ? 20 : -20;
        }).attr("dy", 5).attr("text-anchor", function (thing) {
            return thing.quadrant.isLeft() ? "start" : "end";
        });
        this.force.start();
    };
    return Radar;
})();
$(function () {
    var things = [
        new Thing("C++", Quadrant.Languages, 0.9), 
        new Thing("Scala", Quadrant.Languages, 0.6), 
        new Thing("TypeScript", Quadrant.Languages, 0.7), 
        new Thing("C#", Quadrant.Languages, 0.1), 
        new Thing("APL", Quadrant.Languages, 0.8), 
        new Thing("Continuous Integration", Quadrant.Techniques, 0.8), 
        new Thing("CodeSourcery GCC", Quadrant.Platforms, 0.5), 
        new Thing("NCrunch", Quadrant.Tools, 0.5), 
        new Thing("Git", Quadrant.Tools, 0.6), 
        
    ];
    var radar = new Radar(400);
    for(var i = 0; i != things.length; i++) {
        radar.addThing(things[i]);
    }
    radar.restart();
});
