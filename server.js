// server component, largely based on Ian's script, 
// Ensures requests are valid before passing on to handlers


var http = require("http"),
   url = require("url");

function start(port, route, handle) {
   function onRequest(request, response) {
      var pathname = url.parse(request.url).pathname;
      route(handle, pathname, response, request);
   }

   var service = http.createServer(onRequest)
   service.listen(port, "localhost");
   var address = "http://localhost";
   if (port != 80) address = address + ":" + port;
   console.log("Server running at", address);
}

exports.start = start;