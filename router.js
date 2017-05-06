
// routes requests from the server to the appropriate request
// handlers should be set up in entry script: index.js


function route(handle, pathname, response, request) {
//   console.log("About to route a request for " + pathname);

   // urls with parameters - strip params for routing purposes
   var paramStart = pathname.indexOf("&");
   if(paramStart>1){
      pathname = pathname.substring(0,paramStart);
   }
   if (typeof handle[pathname] === 'function') {
      handle[pathname](response, request);
   } else {
      // standard file handlers
      handle["*file*"](response, request);
   }
}
exports.route = route;