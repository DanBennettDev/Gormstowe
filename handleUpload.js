// author: Dan Bennett
// handles upload requests


var querystring = require("querystring"),
   fs = require("fs"),
   formidable = require("formidable"),
   uuid = require('node-uuid'),
   jsdom = require("jsdom"),
   url = require("url"),
   requestParser = require("./requestParser"),
   globals = require("./globals");

var imageProcess;
var dbAction;
var handleMap;


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
      if(!isValidType(files)){
         // TODO - handle client side, this is just a batstop
         console.log("invalid type or no file");
         show();
         return;
      } 
      var caption = fields.captionText;
      var name = fields.name;
      if(caption==globals.defaultCaption){caption="";}
      if(name==globals.defaultName){name="";}
      functionType = fields.itemType == "object" ? "object" : "field";
      var fileURL = globals.uploadFolder + fileID + ".png";

      var textureOptions=0;
      if(fields.venetian=="venetian"){textureOptions |= globals.imgProcessVenetianOn;}
      if(fields.rotate=="rotate"){
         console.log("rotate registered");
         console.log(globals.imgProcessRotateOn);
         textureOptions |= globals.imgProcessRotateOn;
      }
      if(fields.colourise=="colourise"){textureOptions |= globals.imgProcessColouriseOn;}

      console.log("options: " + textureOptions);

      if(functionType != "field"){
         imageProcess.convertPNG(files.upload.path, "./public" + fileURL, 
                        logImage);
      } else {
         // just convert to png
         imageProcess.processImage(files.upload.path,
               "./public" + fileURL,4,8, textureOptions, logImage);
      }



      function logImage(err, info){
         if (err) {
            console.log(err);
         }
         var details = 
            {  $ownerID: 1, // TODO : dummy
               $positionX: locX,
               $positionY: locY,
               $name: name, 
               $fileURL: fileURL,
               $functionType: functionType,
               $type: "image",
               $image_Width: info.width,
               $image_Height: info.height,
                     $captionText: caption
            };
         dbAction.createItem(details, show);
      }

      function show() {
         handleMap.location(response, request);
      }
   });
}





function isValidType(thisFile){
   if("undefined" === typeof thisFile || 
      "undefined" === typeof thisFile.upload ){
      return false;
   }

   for(var typ of globals.acceptImageTypes){
      if(!("undefined" === typeof thisFile.upload.type) 
                     && thisFile.upload.type==typ){
         return true;
      }
   }
   console.log("invalid file type");
   return false;

}

exports.upload = upload;
exports.setup = setup;
