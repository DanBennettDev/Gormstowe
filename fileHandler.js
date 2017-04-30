// handles explicit file requests

var fs = require("fs");
var types, banned; 
var OK = 200, NotFound = 404, BadType = 415, Error = 500;

// Serve a request by delivering a file.
function handle(response, request) {
   var url = request.url.toLowerCase();
   if (url.endsWith("/")) url = url + "index.html";
   if (isBanned(url)) return fail(response, NotFound, "URL has been banned");
   var type = findType(url);
   if (type == null) return fail(response, BadType, "File type unsupported");
   var file = "./public" + url;
   fs.readFile(file, ready);

   function ready(err, content) {
      deliver(response, type, err, content);
   }
}


function setup() {
   types = defineTypes();
   banned = [];
   banUpperCase("./public/", "");
}

// Forbid any resources which shouldn't be delivered to the browser.
function isBanned(url) {
   for (var i = 0; i < banned.length; i++) {
      var b = banned[i];
      if (url.startsWith(b)) return true;
   }
   return false;
}

// Find the content type to respond with, or undefined.
function findType(url) {
   var dot = url.lastIndexOf(".");
   var extension = url.substring(dot + 1);
   return types[extension];
}


// Deliver the file that has been read in to the browser.
function deliver(response, type, err, content) {
   if (err) return fail(response, NotFound, "File not found");
   var typeHeader = {
      "Content-Type": type
   };
   response.writeHead(OK, typeHeader);
   response.write(content);
   response.end();
}

// Give a minimal failure response to the browser
function fail(response, code, text) {
   var textTypeHeader = {
      "Content-Type": "text/plain"
   };
   response.writeHead(code, textTypeHeader);
   response.write(text, "utf8");
   response.end();
}



// Check a folder for files/subfolders with non-lowercase names.  Add them to
// the banned list so they don't get delivered, making the site case sensitive,
// so that it can be moved from Windows to Linux, for example. Synchronous I/O
// is used because this function is only called during startup.  This avoids
// expensive file system operations during normal execution.  A file with a
// non-lowercase name added while the server is running will get delivered, but
// it will be detected and banned when the server is next restarted.
function banUpperCase(root, folder) {
   var folderBit = 1 << 14;
   var names = fs.readdirSync(root + folder);
   for (var i = 0; i < names.length; i++) {
      var name = names[i];
      var file = folder + "/" + name;
      if (name != name.toLowerCase()) banned.push(file.toLowerCase());
      var mode = fs.statSync(root + file).mode;
      if ((mode & folderBit) == 0) continue;
      banUpperCase(root, file);
   }
}


// The most common standard file extensions are supported, and html is
// delivered as xhtml ("application/xhtml+xml").  Some common non-standard file
// extensions are explicitly excluded.  This table is defined using a function
// rather than just a global variable, because otherwise the table would have
// to appear before calling start().  NOTE: for a more complete list, install
// the mime module and adapt the list it provides.
function defineTypes() {
   var types = {
      html: "application/xhtml+xml",
      css: "text/css",
      js: "application/javascript",
      png: "image/png",
      gif: "image/gif", // for images copied unchanged
      jpeg: "image/jpeg", // for images copied unchanged
      jpg: "image/jpeg", // for images copied unchanged
      svg: "image/svg+xml",
      json: "application/json",
      pdf: "application/pdf",
      txt: "text/plain",
      ttf: "application/x-font-ttf",
      woff: "application/font-woff",
      aac: "audio/aac",
      mp3: "audio/mpeg",
      mp4: "video/mp4",
      webm: "video/webm",
      ico: "image/x-icon", // just for favicon.ico
      xhtml: undefined, // non-standard, use .html
      htm: undefined, // non-standard, use .html
      rar: undefined, // non-standard, platform dependent, use .zip
      doc: undefined, // non-standard, platform dependent, use .pdf
      docx: undefined, // non-standard, platform dependent, use .pdf
   }
   return types;
}



exports.handle = handle;
exports.setup = setup;