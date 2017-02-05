
// routes requests from the server to the appropriate request

function route(handle, pathname, response, request) {
	console.log("About to route a request for " + pathname);
	// explicit handlers
	if (typeof handle[pathname] === 'function') {
		handle[pathname](response, request);
	} else {
		// standard file handlers
		handle["*file*"](response, request);
	}
}
exports.route = route;