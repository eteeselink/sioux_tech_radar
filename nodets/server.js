var http = require("http")
var fs = require("fs")
var Express = require("express")
var socketIO = require("socket.io")
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
var thingSocket = sio.of("/Thing").on('connection', function (socket) {
    socket.on('register', function (name) {
        console.log("connected with Thing(" + name + ")");
        socket.on('disconnect', function () {
            return console.log("disconnected with Thing(" + name + ")");
        });
    });
});
