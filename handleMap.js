// author: Dan Bennett
// request handling for mapPages


var querystring = require("querystring"),
   fs = require("fs"),
   jsdom = require("jsdom"),
   url = require("url"),
   requestParser = require("./requestParser"),
   globals = require("./globals");

var locationPageTemplate, captionTemplate,
   dbAction;

function setup(dbHandler){
   // used regularly - load to memory once
   locationPageTemplate = fs.readFileSync("./templates/location.html", 'utf8');
   captionTemplate = fs.readFileSync("./templates/caption.html", 'utf8');


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
      var help = parseFloat(requestParser.getParam(action,'help'))==1.0 ? true : false;

      // populate page variables
      window.document.getElementById("initVariables").innerHTML 
                     = "var locX= " +x
                     +"; \nvar locY= " +y+";"
                     +"; \nvar help= " +help+";"

      //window.document.getElementById("upload_form").action = action;
      populateMap();


      function populateMap(){
         var xShowStart = x-w/2, 
            xShowEnd = x+w/2,
            yShowStart = y-h/2, 
            yShowEnd = y+h/2,
            xLoadStart = x-(3*w/2), // load an extra screen to left to allow for image widths
            xLoadEnd = x+(3*w/2),
            yLoadStart = y-(3*h/2), 
            yLoadEnd = y+(3*h/2);


         dbAction.getItemsInLocRange(xLoadStart, xLoadEnd, 
                              yLoadStart, yLoadEnd, 
                              insertItems);

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
            //    on upload and set as background layer when parallax 
            //    scrolling is implemented)
            var relX = 100*(thisRow.positionX - xShowStart) / (xShowEnd - xShowStart);
            var relY = 100*(thisRow.positionY - yShowStart) / (yShowEnd - yShowStart);
            var hasCaption = thisRow.caption.length >0 ? 1 : 0;
            var type = thisRow.itemFunction == 'object' ? 'imageObject' : 'bgObject';
            // THE DIV
            var insert = '<div id="' + type + thisRow.itemID + '" class="' + type + '" ';
            // store world-position as data to separate from client-side element positioning
            var data =  'data-posX="' + thisRow.positionX + '"';
            data +=  ' data-posY="' + thisRow.positionY + '"';
            data +=  ' data-hasCaption="' + hasCaption + '"';
            data +=  ' style="top:' + relY + '%; left:'+ relX +'%;"';
            
            insert += data;
            // THE IMAGE
            insert +=   '><img src="'+thisRow.URL+'"></img>';
            insert +=   '</div>';   
            
            // THE CAPTION (separate div for Z-index purposes)
            // if(thisRow.itemFunction == 'object' && hasCaption==1){
            // for the moment this is the only route to deleting an item,
            // so adding a "caption" unconditionally. TODO: find more elegant solution to deleting
            var thisCaption = captionTemplate.replaceAll("$data", data);
            thisCaption = thisCaption.replaceAll("$caption", thisRow.caption);
            thisCaption = thisCaption.replaceAll("$itemID", thisRow.itemID);
            thisCaption = thisCaption.replaceAll("$xPos", thisRow.positionX);
            thisCaption = thisCaption.replaceAll("$yPos", thisRow.positionY);
            thisCaption = thisCaption.replaceAll("$width", globals.gridSquareWidth);
            thisCaption = thisCaption.replaceAll("$height", globals.gridSquareHeight);

            insert +=thisCaption;
            // }
            return insert;       
         }

         // taken from here http://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string-in-javascript
         String.prototype.replaceAll = function(search, replacement) {
             var target = this;
             return target.split(search).join(replacement);
         };


      }

   }
}






exports.location = location;
exports.setup = setup;










