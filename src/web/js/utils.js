var TechRadar;
(function (TechRadar) {
    var Enum = (function () {
        function Enum(clss) {
            this.clss = clss;
        }
        Enum.prototype.toString = function () {
            var classObj = this['constructor'];
            for(var key in classObj) {
                if(this.clss[key] === this) {
                    return key;
                }
            }
            return null;
        };
        return Enum;
    })();
    TechRadar.Enum = Enum;    
    function random(from, to) {
        var domain = to - from;
        return Math.random() * domain + from;
    }
    TechRadar.random = random;
    function cap(lowerBound, value, upperBound) {
        return Math.max(lowerBound, Math.min(upperBound, value));
    }
    TechRadar.cap = cap;
})(TechRadar || (TechRadar = {}));

