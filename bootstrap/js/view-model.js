var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var TechRadar;
(function (TechRadar) {
    (function (Client) {
        var deg45 = Math.PI / 4;
        var Quadrant = (function (_super) {
            __extends(Quadrant, _super);
            function Quadrant(xloc, yloc, angle) {
                        _super.call(this, Quadrant);
                this.xloc = xloc;
                this.yloc = yloc;
                this.angle = angle;
            }
            Quadrant.Tools = new Quadrant(1, -1, 1 * deg45);
            Quadrant.Techniques = new Quadrant(-1, -1, 3 * deg45);
            Quadrant.Platforms = new Quadrant(-1, 1, -3 * deg45);
            Quadrant.Languages = new Quadrant(1, 1, -1 * deg45);
            Quadrant.prototype.angleLower = function () {
                return this.angle - deg45;
            };
            Quadrant.prototype.angleUpper = function () {
                return this.angle + deg45;
            };
            Quadrant.prototype.isLeft = function () {
                return this.xloc < 0;
            };
            Quadrant.prototype.isTop = function () {
                return this.yloc < 0;
            };
            return Quadrant;
        })(TechRadar.Enum);
        Client.Quadrant = Quadrant;        
        var Thing = (function (_super) {
            __extends(Thing, _super);
            function Thing(name, quadrant, goodness) {
                        _super.call(this, null, null);
                this.name = name;
                this.quadrant = quadrant;
                var r = goodness * Client.Radar.radius;
                var phi = quadrant.angle + TechRadar.random(0.01, 0.02);
                this.polar = new Client.Polar(r, phi);
                this.updateXY();
            }
            Thing.prototype.setupListener = function () {
                var socket = Client.Bus.Thing();
                socket.on(name, function (data) {
                    console.log("yay got(" + name + ") data " + JSON.stringify(data));
                });
                socket.emit("register", name);
            };
            Thing.prototype.notifyServer = function () {
                var socket = Client.Bus.Thing();
                socket.emit(name, this.goodness());
            };
            Thing.prototype.updatePolar = function () {
                this.prevPolar = this.polar;
                this.polar = Client.Polar.fromPoint(this.x, this.y);
                this.notifyServer();
            };
            Thing.prototype.fixRadius = function (goodnessEditable) {
                if((!this.isBeingDragged()) || (!goodnessEditable)) {
                    this.polar.r = this.prevPolar.r;
                    this.notifyServer();
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
                return this.polar.r / Client.Radar.radius;
            };
            return Thing;
        })(Client.D3Node);
        Client.Thing = Thing;        
    })(TechRadar.Client || (TechRadar.Client = {}));
    var Client = TechRadar.Client;

})(TechRadar || (TechRadar = {}));

