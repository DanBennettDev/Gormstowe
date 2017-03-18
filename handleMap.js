// author: Dan Bennett
// request handling for mapPages


var querystring = require("querystring"),
	fs = require("fs"),
	jsdom = require("jsdom"),
	url = require("url");

var locationPageTemplate;

function setup(){
	// used regularly - load to memory once
	locationPageTemplate = fs.readFileSync("./templates/location.html", 'utf8');
}


function location(response, request){
	jsdom.env(locationPageTemplate, locationResponse);

	function locationResponse(err, window){
		var requestAction = url.parse(request.url).pathname;
		var paramStart = requestAction.indexOf("&");
		if(paramStart==-1){
			console.log("error - no parameters in location request")
			return;
		}
		var params = requestAction
			.substring(paramStart,requestAction.length+1);
		var action = "/upload"+ params;
		var x = action.substring(action.indexOf("x")+2, action.indexOf("x")+7);
		var y = action.substring(action.indexOf("y")+2, action.indexOf("y")+7);

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
