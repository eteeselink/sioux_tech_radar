var TechRadar;
(function (TechRadar) {
    (function (Client) {
        var Guid = (function () {
            function Guid() { }
            Guid.New = function New() {
                var S4 = function () {
                    return Math.floor(Math.random() * 65536).toString(16);
                };
                return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
            }
            return Guid;
        })();        
        var Bus = (function () {
            function Bus() {
                var http = location.protocol;
                var slashes = http.concat("//");
                var port = window.location.port;
                var host = slashes.concat(window.location.hostname).concat(":" + port);
                this.thingSocket = io.connect(host + "/Thing");
                this.personSocket = io.connect(host + "/Person");
                this.opinionSocket = io.connect(host + "/Opinion");
            }
            Bus.single = null;
            Bus.instance = function instance() {
                if(Bus.single == null) {
                    Bus.single = new Bus();
                }
                return Bus.single;
            }
            Bus.Thing = function Thing() {
                return Bus.instance().getSocket("Thing");
            }
            Bus.Person = function Person() {
                return Bus.instance().getSocket("Person");
            }
            Bus.Opinion = function Opinion() {
                return Bus.instance().getSocket("Opinion");
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
        Client.Bus = Bus;        
    })(TechRadar.Client || (TechRadar.Client = {}));
    var Client = TechRadar.Client;

})(TechRadar || (TechRadar = {}));

//@ sourceMappingURL=socket.js.map
