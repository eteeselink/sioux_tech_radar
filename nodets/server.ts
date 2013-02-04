///<reference path='../headers/node/node.d.ts' />
///<reference path='../headers/express/express.d.ts' />
///<reference path='../headers/socket.io/socket.io.d.ts' />
///<reference path='things.ts' />
///<reference path='persons.ts' />

import http = module("http")
import fs = module("fs")
import Express = module("express")
import socketIO = module("socket.io")

module TechRadar.Server{

  export class Server{
    public static Start(){
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

      //var things = new Things(sio, Persons.GetCurrentUser());
    }
  }
}

TechRadar.Server.Server.Start();