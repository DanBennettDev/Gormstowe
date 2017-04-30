// author: Dan Bennett
// request handling for mapPages


var querystring = require("querystring"),
   fs = require("fs"),
   formidable = require("formidable"),
   uuid = require('node-uuid'),
   jsdom = require("jsdom"),
   url = require("url");

function location(response, request){

   jsdom.env(locationPageTemplate, locationResponse);

   function locationResponse(err, window){
      var info = "you clicked: " + url.parse(request.url).pathname;
      window.document.getElementById("currentLocation").innerHTML = info;
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(jsdom.serializeDocument(window.document));
      response.end();
   }
}
