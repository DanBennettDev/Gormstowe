// author: Dan Bennett
// handles upload requests


var querystring = require("querystring"),
   url = require("url"),
   requestParser = require("./requestParser"),
   globals = require("./globals");


var dbAction;
var handleMap;


function setup(dbHandler, mapHandler) {
   dbAction = dbHandler;
   handleMap = mapHandler;
}


function deleteItem(response, request) {

   var params = requestParser.getParamString(request);
   var itemID = requestParser.getParam(params,'id');

   dbAction.deleteItem(itemID, show);
   
   function show() {
      handleMap.location(response, request);
   }
}



exports.deleteItem = deleteItem;
exports.setup = setup;
