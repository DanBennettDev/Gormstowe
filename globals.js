

const    port = 8080,
      maxImageWidth = 800, 
      maxImageHeight = 800,
      db_location = "./db/db1.db",
      uploadFolder = "/img/uploads/",
      tmpFolder = "./tmp/";
      acceptImageTypes = [
      "image/png","image/gif",
      "image/jpeg","image/jpeg"],
      defaultCaption = "enter text",
      defaultName = "enter name",
      gridSquareWidth = 10, 
      gridSquareHeight = 10,
      imgProcessVenetianOn = 4,
      imgProcessRotateOn = 2,
      imgProcessColouriseOn = 1;

exports.port = port;
exports.maxImageWidth = maxImageWidth;
exports.maxImageHeight = maxImageHeight;
exports.db_location = db_location;
exports.uploadFolder = uploadFolder;
exports.tmpFolder = tmpFolder;
exports.acceptImageTypes = acceptImageTypes;
exports.defaultCaption = defaultCaption;
exports.defaultName = defaultName;
exports.gridSquareWidth = gridSquareWidth;
exports.gridSquareHeight = gridSquareHeight;
exports.imgProcessVenetianOn = imgProcessVenetianOn;
exports.imgProcessRotateOn = imgProcessRotateOn;
exports.imgProcessColouriseOn = imgProcessColouriseOn;




