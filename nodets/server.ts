///<reference path='../headers/node/node.d.ts' />
///<reference path='../headers/express/express.d.ts' />
///<reference path='../headers/socket.io/socket.io.d.ts' />


import http = module("http")
import fs = module("fs")
import Express = module("express")
import socketIO = module("socket.io")

var app= <Express.ServerApplication> Express();
var server = http.createServer(app);
var sio = socketIO.listen(server);

// set static content to be served from the bootstrap dir
app.use(Express.static('../bootstrap'));

// default route is index.html
app.get('/', function(request, response) {
  fs.readFile('../boostrap/index.html', function (err, data) {
    response.send(data);
  });
});

// setup to listen on the port that heroku wants us to
var port = process.env.PORT || 5000;
server.listen(port, function() {
  console.log("Listening on " + port);
});
var thingSocket= sio.of("/Thing")
    .on('connection',(socket:socketIO.Socket)=>{
        socket.on('register',(name:string)=>{
            console.log("connected with Thing("+name+")");
            socket.on('disconnect',()=>
                console.log("disconnected with Thing("+name+")"));
        });
    });
