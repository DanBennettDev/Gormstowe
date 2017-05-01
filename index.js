// Simple modular server

// This is the entry module. Stitches everything else together
// designed like this so I can easily expand/change by changing/swapping out individual modules




var server = require("./server"),
   router = require("./router"),
   // requestHandlers is gradually being replaced by individual handler modules
   requestHandlers = require("./requestHandlers"),
   handleMap = require("./handleMap"),
   handleUpload = require("./handleUpload"),
   handleDelete = require("./handleDelete"),
   fileRequestHandler = require("./fileHandler"),
   imagePrep = require("./imagePrep"),
   dbHandling = require("./dbHandling"),
   globals = require("./globals");



// setup image handling
imagePrep.setup(globals.maxImageWidth, globals.maxImageHeight);
dbHandling.setup(globals.db_location);

// setup & connect request handlers
var handle = {};

// standard files
fileRequestHandler.setup();
handle["*file*"] = fileRequestHandler.handle;

// dynamic stuff
requestHandlers.setup(imagePrep, dbHandling);
handleMap.setup(dbHandling);
handleUpload.setup(imagePrep, dbHandling, handleMap);
handleDelete.setup(dbHandling, handleMap);

handle["/"] = requestHandlers.handle;
handle["/explore"] = requestHandlers.explore;
handle["/upload"] = handleUpload.upload;
handle["/delete"] = handleDelete.delete;
handle["/location"] = handleMap.location;

server.start(globals.port, router.route, handle);

//dbHandling.test();
