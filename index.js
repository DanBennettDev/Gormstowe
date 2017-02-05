// Simple server based on Ian Holyer's server.js file provided for UoB WebTech course

// ian's header:
// Run a node.js web server for local development of a static web site.
// Start with "node server.js" and put pages in a "public" sub-folder.
// Visit the site at the address printed on the console.

// The server is configured to be platform independent.  URLs are made lower
// case, so the server is case insensitive even on Linux, and paths containing
// upper case letters are banned so that the file system is treated as case
// sensitive even on Windows.

// Load the library modules, and define the global constants.
// See http://en.wikipedia.org/wiki/List_of_HTTP_status_codes.
// Start the server: change the port to the default 80, if there are no
// privilege issues and port number 80 isn't already in use.


var server = require("./server"),
	router = require("./router"),
	requestHandlers = require("./requestHandlers"),
	fileRequestHandler = require("./fileHandler")

var port = 8080

// setup & connect request handlers
var handle = {};
fileRequestHandler.setup();
handle["*file*"] = fileRequestHandler.handle;

// special cases
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/show"] = requestHandlers.show;


server.start(port, router.route, handle);
