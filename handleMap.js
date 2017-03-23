// author: Dan Bennett
// request handling for mapPages


var querystring = require("querystring"),
	fs = require("fs"),
	jsdom = require("jsdom"),
	url = require("url"),
	requestParser = require("./requestParser");

var locationPageTemplate, 
	dbAction;

function setup(dbHandler){
	// used regularly - load to memory once
	locationPageTemplate = fs.readFileSync("./templates/location.html", 'utf8');
	dbAction = dbHandler;
}


function location(response, request){
	jsdom.env(locationPageTemplate, locationResponse);

	function locationResponse(err, window){
		var action = "/upload"+ requestParser.getParamString(request);
		var x = parseFloat(requestParser.getParam(action,'x'));
		var y = parseFloat(requestParser.getParam(action,'y'));
		var w = parseFloat(requestParser.getParam(action,'w'));
		var h = parseFloat(requestParser.getParam(action,'h'));

		window.document.getElementById("initVariables").innerHTML 
							= "var locX= " +x+"; \nvar locY= " +y+";";

		//window.document.getElementById("upload_form").action = action;
		populateMap();


		function populateMap(){
			var xStart = x-w/2,	xEnd = x+w/2;
			var yStart = y-h/2, yEnd = y+h/2;

			dbAction.getItemsInLocRange(xStart, xEnd, yStart, yEnd, insertItems);

			function insertItems(rows){
				var mapContents="";
				for(var row of rows){
					mapContents+=processRows(row); 
				}
				window.document.getElementById("locationDisplay").innerHTML = mapContents;
				response.writeHead(200, { "Content-Type": "text/html" });
				response.write(jsdom.serializeDocument(window.document));
				response.end();
			}

			function processRows(thisRow){
				// TODO: for now, only handling images
				if(thisRow.itemType == 'image'){					
					return processImageRow(thisRow);
				}
				return '' // TODO - complete this after writing db fetch function
			}

			function processImageRow(thisRow){
				// TODO: for now, handling all as "objects" 
				//  ("fields" will eventually  be processed into textures 
				// 	on upload and set as background layer when parallax 
				// 	scrolling is implemented)
				var relX = 100*(thisRow.positionX - xStart) / (xEnd - xStart);
				var relY = 100*(thisRow.positionY - yStart) / (yEnd - yStart);

				var hasCaption = thisRow.caption.length >0 ? 1 : 0;
				// THE DIV
				var insert = '<div id="imageObject'+ thisRow.itemID + '" ';
				// store world-position as data to separate from client-side element positioning
				insert += 	'class="imageObject" data-posX="' + thisRow.positionX + '"';
				insert +=	' data-posY="' + thisRow.positionY + '"';
				insert +=	' data-hasCaption="' + hasCaption + '"';
				insert +=	' style="top:' + relY + '%; left:'+ relX +'%;"';
				
				// THE IMAGE
				insert += 	'><img src="'+thisRow.URL+'"></img>';
				
				if(hasCaption==1){
					insert+='<div id="caption'+thisRow.itemID+'" class="caption">'+thisRow.caption+'<br/><a onClick="loc.closeCaption('+thisRow.itemID + '); return false;" class="closeCaption" href="#">close</a></div>';
					insert+='<div id="captionLink'+thisRow.itemID+'" class="captionLink"><a class="showCaption" onClick="loc.showCaption('+thisRow.itemID + '); return false;" href="#">[...]</a></div>';

				}
				insert +=	'</div>';	


				return insert;			
			}

		}

	}
}






exports.location = location;
exports.setup = setup;










