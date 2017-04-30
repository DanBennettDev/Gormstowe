// author: Dan Bennett
// request handling...


var querystring = require("querystring"),
   fs = require("fs"),
   formidable = require("formidable"),
   uuid = require('node-uuid'),
   jsdom = require("jsdom"),
   url = require("url"),
   requestParser = require("./requestParser"),
   globals = require("./globals");

var explorePageTemplate;

function setup(imageProcessor, dbHandler) {
   explorePageTemplate = fs.readFileSync("./templates/explore.html", 'utf8');
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
      var link = '<a href="';
      var theMap = '';
      for(var i=0; i<81; i++){
         var x = (i%9)*10;
         var y = Math.floor(i/9) * 10;
         // todo - 10 hardcoded for W and height - will likely want to change this later
         var thisLink = link + requestParser.buildLocationURL("location",x,y, 
                     globals.gridSquareHeight, globals.gridSquareHeight, true)+'">';
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





exports.setup = setup;
exports.explore = explore;


