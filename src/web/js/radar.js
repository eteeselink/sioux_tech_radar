var TechRadar;
(function (TechRadar) {
    (function (Client) {
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
            Radar.prototype.addOpinion = function (opinion) {
                this.opinions.push(opinion);
                this.restart();
            };
            Radar.prototype.removeOpinion = function (opinion) {
                var index_opinion = this.opinions.indexOf(opinion);
                this.opinions.splice(index_opinion, 1);
                this.restart();
            };
            Radar.prototype.countOpinions = function () {
                return this.opinions.length;
            };
            Radar.prototype.createSvg = function (auxClasses, margin) {
                var svg = d3.select("#contents").append("svg").attr("class", "radar " + auxClasses).attr("width", this.diameter * (this.quadrant ? 1.5 : 2)).attr("height", this.diameter * margin);
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
                this.drawLabeledCircle("Proberen", 0.40, Radar.radius * 0.7);
                this.drawCenteredCircle(Radar.radius * 0.85);
                this.drawLabeledCircle("Experimenteren", 0.53, Radar.radius * 0.86);
                this.drawLabeledCircle("Afblijven", 0.27, Radar.radius * 1.0);
                var axislen = Radar.radius * axisLengthFactor;
                this.drawLine(0, axislen, 0, -axislen);
                this.drawLine(axislen, 0, -axislen, 0);
                this.svg.append("text").attr("class", "quadrant-label");
            };
            Radar.prototype.setupForceLayout = function () {
                var _this = this;
                this.force = d3.layout.force().nodes([]).size([
                    Radar.radius * 2, 
                    Radar.radius * 2
                ]).gravity(0).charge(-50).on("tick", function (e) {
                    return _this.tick(e);
                });
                this.opinions = this.force.nodes();
            };
            Radar.prototype.restart = function () {
                var _this = this;
                var circles = this.svg.selectAll("circle.thing").data(this.opinions);
                var textThings = this.svg.selectAll("text.thing").data(this.opinions);
                circles.exit().remove();
                textThings.exit().remove();
                circles.enter().append("circle").attr("class", "thing").attr("id", function (opinion) {
                    return "opinion_" + opinion.thing.name;
                }).attr("r", 4).on("mousedown", function (opinion, index) {
                    _this.select(opinion);
                }).call(this.force.drag);
                textThings.enter().append("text").attr("class", "thing").attr("text-anchor", function (opinion) {
                    return opinion.thing.quadrant().isLeft() ? "end" : "start";
                });
                textThings.text(function (opinion) {
                    return opinion.thing.title;
                });
                this.force.start();
            };
            Radar.prototype.unselectAll = function () {
                console.log('unselect');
                this.svg.select(".selected-opinion").classed('selected-opinion', false);
            };
            Radar.prototype.select = function (opinion) {
                this.unselectAll();
                this.svg.select("#opinion_" + opinion.thing.name).classed('selected-opinion', true);
                opinion.onSelectCallback();
            };
            Radar.prototype.tick = function (e) {
                var _this = this;
                this.opinions.forEach(function (opinion) {
                    var quadrant = opinion.thing.quadrant();
                    opinion.updatePolar(_this.goodnessEditable);
                    opinion.fixRadius(_this.goodnessEditable);
                    opinion.polar.phi += (quadrant.angle - opinion.polar.phi) * e.alpha * Radar.quadrantGravity;
                    var borderOffset = 10 / (opinion.polar.r + 0.1);
                    opinion.polar.phi = TechRadar.cap(quadrant.angleLower() + borderOffset, opinion.polar.phi, quadrant.angleUpper() - borderOffset);
                    opinion.polar.r = Math.min(opinion.polar.r, Radar.radius);
                    opinion.updateXY();
                });
                var origin = this.diameter / 2;
                this.svg.selectAll("circle.thing").attr("cx", function (opinion) {
                    return opinion.x;
                }).attr("cy", function (opinion) {
                    return opinion.y;
                });
                this.svg.selectAll("text.thing").attr("x", function (opinion) {
                    return opinion.x + (opinion.thing.quadrant().isLeft() ? -10 : 10);
                }).attr("y", function (opinion) {
                    return opinion.y + 4;
                });
            };
            Radar.prototype.drawLine = function (x1, y1, x2, y2) {
                this.svg.append("line").attr("class", "lines").attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2);
            };
            Radar.prototype.drawLabeledCircle = function (name, arcWidth, r) {
                var quadrant = this.quadrant || Client.Quadrant.Tools;
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
                this.svg.append("text").append("textPath").attr("xlink:href", "#" + id).attr("startOffset", quadrant.isTop() ? "0%" : "50%").append("tspan").attr("dy", 8 + (quadrant.isTop() ? 2 : -4)).attr("dx", 5).text(name);
            };
            Radar.prototype.drawCenteredCircle = function (r) {
                this.svg.append("circle").attr("class", "lines").attr("cx", 0).attr("cy", 0).attr("r", r);
            };
            return Radar;
        })();
        Client.Radar = Radar;        
    })(TechRadar.Client || (TechRadar.Client = {}));
    var Client = TechRadar.Client;
})(TechRadar || (TechRadar = {}));
