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
        var svg = d3.select("body").append("svg").attr("class", "radar").attr("width", this.width * 2).attr("height", this.width + ymargin * 2);
        var translatex = Radar.radius * 2;
        var translatey = Radar.radius + ymargin;
        var scale = this.width / (Radar.radius * 2);
        this.svg = svg.append("g").attr("transform", "scale(" + scale + ") translate(" + translatex + ", " + translatey + ")");
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
