///<reference path='node.d.ts' />

import http = module("http")
import fs = module("fs")
import express = module("express")

var app = express.createServer();
app.use(express.static('../bootstrap'));

// read the index.html
app.get('/', function(request, response) {
  fs.readFile('../boostrap/index.html', function (err, data) {
    response.send(data);
  });
});

// setup to listen on the port that heroku wants us to
var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
