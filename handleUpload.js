// author: Dan Bennett
// handles upload requests


var querystring = require("querystring"),
	fs = require("fs"),
	formidable = require("formidable"),
	uuid = require('node-uuid'),
	jsdom = require("jsdom"),
	url = require("url"),
	requestParser = require("./requestParser");

var imageProcess;
var dbAction;
var handleMap;
var tmpFolder = "./tmp/";
var uploadFolder = "/img/uploads/";
var acceptTypes = [
		"image/png","image/gif",
		"image/jpeg","image/jpeg"
	]


function setup(imageProcessor, dbHandler, mapHandler) {
	imageProcess = imageProcessor;
	dbAction = dbHandler;
	handleMap = mapHandler;
}



function upload(response, request) {

	var form = new formidable.IncomingForm();
	var params = requestParser.getParamString(request);
	var locX = requestParser.getParam(params,'x');
	var locY = requestParser.getParam(params,'y');

	
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
				{	$ownerID: 1, // TODO : dummy
					$positionX: locX, // TODO : dummy
					$positionY: locY, // TODO : dummy
					$name: fileID,  // TODO : dummy
					$fileURL: fileURL,
					$functionType: "object",
					$type: "image",
					$image_Width: info.width,
					$image_Height: info.height
				};
			dbAction.createItem(details, show);
		}

		function show() {
			handleMap.location(response, request);
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

exports.upload = upload;
exports.setup = setup;
