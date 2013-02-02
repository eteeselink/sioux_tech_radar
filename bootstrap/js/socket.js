define(["require", "exports"], function(require, exports) {
    var Guid = (function () {
        function Guid() { }
        Guid.New = function New() {
            var S4 = function () {
                return Math.floor(Math.random() * 65536).toString(/* 65536 */
                16);
            };
            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        }
        return Guid;
    })();
    exports.Guid = Guid;    
    var Bus = (function () {
        function Bus() {
            this.thingSocket = io.connect("http://localhost/Thing");
            this.personSocket = io.connect("http://localhost/Person");
            this.opinionSocket = io.connect("http://localhost/Opinion");
        }
        Bus.single = null;
        Bus.instance = function instance() {
            if(Bus.single == null) {
                Bus.single = new Bus();
            }
            return Bus.single;
        }
        Bus.prototype.getSocket = function (namespace) {
            if(namespace == "Thing") {
                return this.thingSocket;
            }
            if(namespace == "Person") {
                return this.personSocket;
            }
            if(namespace == "Opinion") {
                return this.opinionSocket;
            }
        };
        return Bus;
    })();
    exports.Bus = Bus;    
})

