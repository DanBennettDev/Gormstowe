// author: Dan Bennett
// request handling...


var querystring = require("querystring"),
	fs = require("fs"),
	formidable = require("formidable"),
	uuid = require('node-uuid'),
	jsdom = require("jsdom"),
	url = require("url");

var imageProcess;
var dbAction;
var explorePageTemplate, locationPageTemplate;
var tmpFolder = "./tmp/";
var uploadFolder = "/img/uploads/";
var acceptTypes = [
		"image/png","image/gif",
		"image/jpeg","image/jpeg"
	]


function setup(imageProcessor, dbHandler) {
	imageProcess = imageProcessor;
	dbAction = dbHandler;
	explorePageTemplate = fs.readFileSync("./templates/explore.html", 'utf8');
	locationPageTemplate = fs.readFileSync("./templates/location.html", 'utf8');
}

// TODO - as this grows move functions into script of its own
function explore(response, request) {

	jsdom.env(explorePageTemplate, generateMap);

	function generateMap(err, window){
		if(err){
			console.log("could not read explore template " + err);
			return;
		}
		// generate map
		var square = '<div class="gridsquare">';
		var link = '<a href="/location&';
		var theMap = '';
		for(var i=0; i<81; i++){
			var x = (i%9)*10;
			var y = Math.floor(i/9) * 10;
			var thisLink = link + 'x='+x+'.0,y='+y+'.0'+'">';
			var newline = thisLink + square + "</div></a>";
			theMap = theMap + newline;
		}
		// insert into div
		window.document.getElementById("map").innerHTML = theMap;

		// return
		response.writeHead(200, { "Content-Type": "text/html" });
		response.write(jsdom.serializeDocument(window.document));
		//response.write(explorePageTemplate);
		response.end();
	}

}

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






function upload(response, request) {
	var form = new formidable.IncomingForm();
	form.parse(request, function(error, fields, files) {

		// use UUID to prevent overwrite
		var fileID = uuid.v4();
		if(!isValidType(files.upload.type)){
			// TODO - handle client side, this is just a batstop
			response.write(explorePageTemplate);
			response.end();
			console.log("invalid type: " +files.upload.type);
			return;
		}
		var fileURL = uploadFolder + fileID + ".png";
		//convert to PNG
		imageProcess.convertPNG(files.upload.path, "./public" + fileURL, 
								logImage);
				// "./public" + uploadFolder + fileID + ".png", show));

		function logImage(err, info){
			if (err) {
				console.log(err);
			}
			var details = 
				{	$ownerID: 0, // TODO : dummy
					$positionX: 0, // TODO : dummy
					$positionY: 0, // TODO : dummy
					$name: fileID,  // TODO : dummy
					$fileURL: fileURL,
					$functionType: "object",
					$type: "image",
					$image_Width: info.width,
					$image_Height: info.height
				};
			dbAction.createItem(details, show);
		}

		// todo - this should be handled by a call to the database based on current "location"
		function show() { // callback: wait til image processed then show
			response.writeHead(200, {
				"Content-Type": "text/html"
			});
			response.write("received image:<br/>");
			response.write("<img src=." + uploadFolder + fileID + ".png>");
			response.end();
		}
	});
}





function isValidType(thisType){
	for(var typ of acceptTypes){
		if(thisType==typ){
			return true;
		}
	}
	return false;
}


exports.setup = setup;
exports.explore = explore;
exports.upload = upload;
exports.location = location;
