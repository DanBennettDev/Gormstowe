// author: Dan Bennett
// request handling...


var querystring = require("querystring"),
	fs = require("fs"),
	formidable = require("formidable"),
	uuid = require('node-uuid'),
	jsdom = require("node-jsdom");

var imageProcess;
var dbAction;
var explorePageTemplate;
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
}

function explore(response, postData) {

	response.writeHead(200, {
		"Content-Type": "text/html"
	});
	response.write(explorePageTemplate);
	response.end();
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


function makeMap(){
	var square = '<div class="gridsquare">';
	var link = '<a href="/location/';
	var theMap = '';
	for(var i=0; i<100; i++){
		var x = (i%10)*10;
		var y = Math.floor(i/10) * 10;
		var thisLink = link + 'x='+x+'y='y;
		theMap += square;
		theMap += thisLink; 
		theMap+="</a></div>"
	}
	return theMap;
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