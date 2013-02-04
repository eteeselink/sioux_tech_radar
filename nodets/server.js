var http = require("http")
var fs = require("fs")
var Express = require("express")
var socketIO = require("socket.io")
var TechRadar;
(function (TechRadar) {
    (function (Server) {
        var Server = (function () {
            function Server() { }
            Server.Start = function Start() {
                var app = Express();
                var server = http.createServer(app);
                var sio = socketIO.listen(server);
                app.use(Express.static('../bootstrap'));
                app.get('/', function (request, response) {
                    fs.readFile('../boostrap/index.html', function (err, data) {
                        response.send(data);
                    });
                });
                var port = process.env.PORT || 5000;
                server.listen(port, function () {
                    console.log("Listening on " + port);
                });
            }
            return Server;
        })();
        Server.Server = Server;        
    })(TechRadar.Server || (TechRadar.Server = {}));
    var Server = TechRadar.Server;

})(TechRadar || (TechRadar = {}));

TechRadar.Server.Server.Start();

