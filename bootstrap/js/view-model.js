var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
define(["require", "exports", 'structs', 'radar', 'socket'], function(require, exports, __Structs__, __RadarModule__, __Socket__) {
    /// <reference path="structs.ts" />
    /// <reference path="radar.ts" />
    /// <reference path="socket.ts" />
    var Structs = __Structs__;

    var RadarModule = __RadarModule__;

    var Socket = __Socket__;

    var deg45 = Math.PI / 4;
    /// base class for fake enums; searches the constructor object
    /// for a slow but functional toString implementation.
    var Enum = (function () {
        function Enum() { }
        Enum.prototype.toString = function () {
            var classObj = this['constructor'];
            for(var key in classObj) {
                if(Quadrant[key] === this) {
                    return key;
                }
            }
            return null;
        };
        return Enum;
    })();    
    /// Emulation of an "enum" with 4 elements. The good thing about
    /// faking an enum with a class and statics is that you can add methods, more
    /// like Java and less like C(#/++/)
    var Quadrant = (function (_super) {
        __extends(Quadrant, _super);
        function Quadrant(xloc, yloc, angle) {
                _super.call(this);
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
    })(Enum);
    exports.Quadrant = Quadrant;    
    /// View model for a "thing" that can be positioned at some place
    /// on the technology radar.
    var Thing = (function (_super) {
        __extends(Thing, _super);
        function Thing(name, quadrant, goodness) {
            // between 0.0 and 1.0; closer to zero is better
                _super.call(this, null, null);
            this.name = name;
            this.quadrant = quadrant;
            var r = goodness * RadarModule.Radar.radius;
            var phi = quadrant.angle + RadarModule.random(0.01, 0.02);
            this.polar = new Structs.Polar(r, phi);
            this.updateXY();
            Socket.Bus.instance().getSocket("Thing").on("Thing", this.notify);
        }
        Thing.prototype.notify = function (data) {
            console.log("yay got data " + data);
        };
        Thing.prototype.updatePolar = function () {
            this.prevPolar = this.polar;
            this.polar = Structs.Polar.fromPoint(this.x, this.y);
        };
        Thing.prototype.fixRadius = function (goodnessEditable) {
            if((!this.isBeingDragged()) || (!goodnessEditable)) {
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
            return this.polar.r / RadarModule.Radar.radius;
        };
        return Thing;
    })(Structs.D3Node);
    exports.Thing = Thing;    
})

