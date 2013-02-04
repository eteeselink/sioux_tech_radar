var TechRadar;
(function (TechRadar) {
    (function (Client) {
        var D3Node = (function () {
            function D3Node(x, y) {
                this.x = x;
                this.y = y;
            }
            return D3Node;
        })();
        Client.D3Node = D3Node;        
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
        Client.Polar = Polar;        
    })(TechRadar.Client || (TechRadar.Client = {}));
    var Client = TechRadar.Client;

})(TechRadar || (TechRadar = {}));

