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
        var phi = quadrant.angle;
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
        var ymargin = 10;
        this.drawBackground(ymargin);
        this.setupForceLayout();
    }
    Radar.radius = 200;
    Radar.quadrantGravity = 0.03;
    Radar.prototype.addThings = function (things) {
        var _this = this;
        things.forEach(function (thing) {
            return _this.things.push(thing);
        });
        this.restart();
    };
    Radar.prototype.drawBackground = function (ymargin) {
        var halfWidth = this.width / 2;
        var translatex = Radar.radius * 2;
        var translatey = Radar.radius + ymargin;
        var scale = this.width / (Radar.radius * 2);
        this.svg = d3.select("body").append("svg").attr("class", "radar").attr("width", this.width * 2).attr("height", this.width + ymargin * 2).append("g").attr("transform", "scale(" + scale + ") translate(" + translatex + ", " + translatey + ")");
        this.drawLabeledCircle("Doen!", 0.53, Radar.radius * 0.4);
        this.drawLabeledCircle("Proberen", 0.44, Radar.radius * 0.7);
        this.drawCenteredCircle(Radar.radius * 0.85);
        this.drawLabeledCircle("Experimenteren", 0.6, Radar.radius * 0.86);
        this.drawLabeledCircle("Afblijven", 0.3, Radar.radius * 1.0);
        this.drawLine(0, Radar.radius * 1.1, 0, -Radar.radius * 1.1);
        this.drawLine(Radar.radius * 1.1, 0, -Radar.radius * 1.1, 0);
    };
    Radar.prototype.setupForceLayout = function () {
        var _this = this;
        this.force = d3.layout.force().nodes([]).size([
            Radar.radius * 2, 
            Radar.radius * 2
        ]).gravity(0).charge(-50).on("tick", function (e) {
            return _this.tick(e);
        });
        this.things = this.force.nodes();
    };
    Radar.prototype.restart = function () {
        var circles = this.svg.selectAll("circle.thing").data(this.things);
        var enter = circles.enter().append("circle");
        enter.attr("class", "thing").attr("r", 6).call(this.force.drag);
        var texts = this.svg.selectAll("text.thing").data(this.things).enter().append("text").attr("class", "thing").attr("dx", function (thing) {
            return (thing.quadrant.isLeft() ? 1 : -1) * 12;
        }).attr("dy", 4).attr("text-anchor", function (thing) {
            return thing.quadrant.isLeft() ? "start" : "end";
        }).text(function (thing) {
            return thing.name;
        });
        this.force.start();
    };
    Radar.prototype.tick = function (e) {
        this.things.forEach(function (thing) {
            thing.updatePolar();
            thing.fixRadius();
            thing.polar.phi += (thing.quadrant.angle - thing.polar.phi) * e.alpha * Radar.quadrantGravity;
            var borderOffset = 10 / (thing.polar.r + 0.1);
            thing.polar.phi = cap(thing.quadrant.angleLower() + borderOffset, thing.polar.phi, thing.quadrant.angleUpper() - borderOffset);
            thing.polar.r = Math.min(thing.polar.r, Radar.radius);
            thing.updateXY();
        });
        var origin = this.width / 2;
        this.svg.selectAll("circle.thing").attr("cx", function (thing) {
            return thing.x;
        }).attr("cy", function (thing) {
            return thing.y;
        });
        this.svg.selectAll("text.thing").attr("x", function (thing) {
            return thing.x;
        }).attr("y", function (thing) {
            return thing.y;
        });
    };
    Radar.prototype.drawLine = function (x1, y1, x2, y2) {
        this.svg.append("line").attr("class", "lines").attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2);
    };
    Radar.prototype.drawLabeledCircle = function (name, endAngle, r) {
        this.drawCenteredCircle(r);
        var arc = d3.svg.arc().innerRadius(r - 0.02 * Radar.radius).outerRadius(r + 0.02 * Radar.radius).startAngle(0).endAngle(endAngle);
        var id = name.replace(/[^a-z]/, "");
        this.svg.append("path").attr("d", arc).attr("id", id).style("stroke", "none").style("fill", "white");
        this.svg.append("text").append("textPath").attr("xlink:href", "#" + id).append("tspan").attr("dy", 10).attr("dx", 5).text(name);
    };
    Radar.prototype.drawCenteredCircle = function (r) {
        this.svg.append("circle").attr("class", "lines").attr("cx", 0).attr("cy", 0).attr("r", r);
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
    var q = [
        Quadrant.Languages, 
        Quadrant.Platforms, 
        Quadrant.Techniques, 
        Quadrant.Tools
    ];
    d3.range(60).forEach(function (i) {
        return things.push(new Thing(i.toString(), q[i % 4], random(0.1, 1.0)));
    });
    var radar = new Radar(500);
    radar.addThings(things);
});
