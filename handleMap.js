// author: Dan Bennett
// request handling for mapPages


var querystring = require("querystring"),
	fs = require("fs"),
	jsdom = require("jsdom"),
	url = require("url"),
	requestParser = require("./requestParser");

var locationPageTemplate;

function setup(){
	// used regularly - load to memory once
	locationPageTemplate = fs.readFileSync("./templates/location.html", 'utf8');
}


function location(response, request){
	jsdom.env(locationPageTemplate, locationResponse);

	function locationResponse(err, window){
		var action = "/upload"+ requestParser.getParamString(request);
		var x = parseFloat(requestParser.getParam(action,'x'));
		var y = parseFloat(requestParser.getParam(action,'y'));

		window.document.getElementById("initVariables").innerHTML 
							= "var locX= " +x+"; \nvar locY= " +y+";";

		//window.document.getElementById("upload_form").action = action;
		response.writeHead(200, { "Content-Type": "text/html" });
		response.write(jsdom.serializeDocument(window.document));
		response.end();
	}
}


exports.location = location;
exports.setup = setup;
