function random(from, to) {
    var domain = to - from;
    return Math.random() * domain + from;
}
function cap(lowerBound, value, upperBound) {
    return Math.max(lowerBound, Math.min(upperBound, value));
}
var Radar = (function () {
    function Radar(diameter, quadrant, goodnessEditable, auxClasses) {
        this.diameter = diameter;
        this.quadrant = quadrant;
        this.goodnessEditable = goodnessEditable;
        var margin = 1.1;
        this.createSvg(auxClasses, margin);
        this.drawBackground(margin);
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
    Radar.prototype.createSvg = function (auxClasses, margin) {
        var svg = d3.select("body").append("svg").attr("class", "radar " + auxClasses).attr("width", this.diameter * (this.quadrant ? 1.5 : 2)).attr("height", this.diameter * (this.quadrant ? margin : (margin * 2 - 1)));
        if(this.quadrant) {
            var scale = this.diameter / Radar.radius;
            var translatex = this.quadrant.isLeft() ? Radar.radius * 1.5 : 0;
            var translatey = this.quadrant.isTop() ? Radar.radius * margin : 0;
        } else {
            var scale = this.diameter / (Radar.radius * 2);
            var translatex = Radar.radius * 2;
            var translatey = Radar.radius * margin;
        }
        this.svg = svg.append("g").attr("transform", "scale(" + scale + ") translate(" + translatex + ", " + translatey + ")");
    };
    Radar.prototype.drawBackground = function (axisLengthFactor) {
        this.drawLabeledCircle("Doen!", 0.47, Radar.radius * 0.4);
        this.drawLabeledCircle("Proberen", 0.4, Radar.radius * 0.7);
        this.drawCenteredCircle(Radar.radius * 0.85);
        this.drawLabeledCircle("Experimenteren", 0.53, Radar.radius * 0.86);
        this.drawLabeledCircle("Afblijven", 0.27, Radar.radius * 1.0);
        var axislen = Radar.radius * axisLengthFactor;
        this.drawLine(0, axislen, 0, -axislen);
        this.drawLine(axislen, 0, -axislen, 0);
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
        circles.enter().append("circle").attr("class", "thing").attr("r", 4).call(this.force.drag);
        this.svg.selectAll("text.thing").data(this.things).enter().append("text").attr("class", "thing").attr("dx", function (thing) {
            return (thing.quadrant.isLeft() ? -1 : 1) * 12;
        }).attr("dy", 4).attr("text-anchor", function (thing) {
            return thing.quadrant.isLeft() ? "end" : "start";
        }).text(function (thing) {
            return thing.name;
        });
        this.force.start();
    };
    Radar.prototype.tick = function (e) {
        var _this = this;
        this.things.forEach(function (thing) {
            thing.updatePolar();
            thing.fixRadius(_this.goodnessEditable);
            thing.polar.phi += (thing.quadrant.angle - thing.polar.phi) * e.alpha * Radar.quadrantGravity;
            var borderOffset = 10 / (thing.polar.r + 0.1);
            thing.polar.phi = cap(thing.quadrant.angleLower() + borderOffset, thing.polar.phi, thing.quadrant.angleUpper() - borderOffset);
            thing.polar.r = Math.min(thing.polar.r, Radar.radius);
            thing.updateXY();
        });
        var origin = this.diameter / 2;
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
    Radar.prototype.drawLabeledCircle = function (name, arcWidth, r) {
        var quadrant = this.quadrant || Quadrant.Tools;
        this.drawCenteredCircle(r);
        if(quadrant.isTop()) {
            var middleAngle = 0;
        } else {
            var middleAngle = Math.PI;
            arcWidth = -arcWidth;
        }
        if(quadrant.isLeft()) {
            var startAngle = middleAngle - arcWidth;
            var endAngle = middleAngle;
        } else {
            var startAngle = middleAngle;
            var endAngle = middleAngle + arcWidth;
        }
        if(!quadrant.isTop()) {
            var h = endAngle;
            endAngle = startAngle;
            startAngle = h;
        }
        var arc = d3.svg.arc().innerRadius(r - 0.02 * Radar.radius).outerRadius(r + 0.02 * Radar.radius).startAngle(startAngle).endAngle(endAngle);
        var id = name.replace(/[^a-z]/, "");
        this.svg.append("path").attr("d", arc).attr("id", id).style("stroke", "none").style("fill", "white");
        this.svg.append("text").append("textPath").attr("xlink:href", "#" + id).attr("startOffset", quadrant.isTop() ? "0%" : "50%").append("tspan").attr("dy", 8).attr("dx", 5).text(name);
    };
    Radar.prototype.drawCenteredCircle = function (r) {
        this.svg.append("circle").attr("class", "lines").attr("cx", 0).attr("cy", 0).attr("r", r);
    };
    return Radar;
})();
