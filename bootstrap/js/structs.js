define(["require", "exports"], function(require, exports) {
    /// A class that mimicks some of the properties that the d3 force layout's
    /// node objects have.
    var D3Node = (function () {
        function D3Node(x, y) {
            this.x = x;
            this.y = y;
        }
        return D3Node;
    })();
    exports.D3Node = D3Node;    
    /// A polar coordinate, including methods to convert from and to
    /// cartesian coordinates.
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
    exports.Polar = Polar;    
})

