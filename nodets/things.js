var TechRadar;
(function (TechRadar) {
    (function (Server) {
        var Thing = (function () {
            function Thing(name, description) {
                this.name = name;
                this.description = description;
            }
            return Thing;
        })();
        Server.Thing = Thing;        
        var Things = (function () {
            function Things(socketManager, currentUser) {
                this.socketManager = socketManager;
                this.currentUser = currentUser;
                this.setupSocketIO();
            }
            Things.prototype.setupSocketIO = function () {
                var _this = this;
                var socketNs = this.socketManager.of("/Thing");
                socketNs.on("connection", function (socket) {
                    socket.on("new", function (name, description) {
                        return _this.Create(new Thing(name, description));
                    });
                    socket.on("update", function (updatedThing) {
                        return _this.Update(updatedThing);
                    });
                    console.log("conntected with a new socket on /Thing");
                });
            };
            Things.prototype.Create = function (newThing) {
                if(this.currentUser.IsAllowedTo(Server.Action.Create, newThing) && !this.HasA(newThing)) {
                    console.log("creating new Thing(" + newThing.name + ")");
                }
            };
            Things.prototype.Update = function (updatedThing) {
                if(this.currentUser.IsAllowedTo(Server.Action.Update, updatedThing) && this.HasA(updatedThing)) {
                    console.log("updating new Thing(" + updatedThing.name + "," + updatedThing.description + ")");
                }
            };
            Things.prototype.HasA = function (thing) {
                return false;
            };
            return Things;
        })();
        Server.Things = Things;        
    })(TechRadar.Server || (TechRadar.Server = {}));
    var Server = TechRadar.Server;

})(TechRadar || (TechRadar = {}));

