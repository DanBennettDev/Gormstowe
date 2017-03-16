
// Image processing functions for the site

var sharp = require("sharp");



function setup(maxWidth, maxHeight) {
   maxW = maxWidth;
   maxH = maxHeight;

}


function limitSize(fileIn) {
   const image = sharp(fileIn);
   image.resize(maxW, maxH)
      .max()
      .withoutEnlargement()
   return image
}

function convertPNG(fileIn, fileOut, onFinish) {
   limitSize(fileIn)
      .png()
      .toFile(fileOut, onFinish);
}


function doHorizOperation(fileIn, fileOut, onRows, offRows, reverse) {
   sharp(fileIn).overlayWith(
      //guarantee 4 layer png
      new Buffer([0, 0, 0, 0]),
      { tile: true, raw: { width: 1, height: 1, channels: 4 } }
  ).metadata( function(err, metadata) {
      width = metadata.width;
      height = metadata.height;
      channels = 4;  // guaranteed by overlaywith above
   }).raw().toBuffer().then(function(buffer) {

      const buffCopy = Object.assign({}, buffer);
      const rowCycle = onRows + offRows;
      console.log(channels);
      for (var i = 0; i < (height); i += 1) {
         if (i % rowCycle < onRows) {
            var start = rowStart(width, channels, i);
            var end = rowEnd(width, channels, i);
            for (var j = 0; j < (width * channels); j += channels) {
               if(!reverse)
                  // set alpha channel to 0
                  buffer[start + j + channels -1]=0;
               else 
                  // switch with mirror pixel
               for(var k=0; k<channels; k++){
                  buffer[start + j + k] = buffCopy[end + k - (j + channels -1)];
               }
            }
         }
      }
     sharp(buffer, {
         raw: {
            width: width,
            height: height,
            channels: channels
         }
      }).png().toFile(fileOut, function(cb) {
         console.log('cb')
      });
   });
}






function rowStart(width, channels, rowNo) {
   return width * channels * rowNo;
}

function rowEnd(width, channels, rowNo) {
   return (width * channels * rowNo) + (width * channels) - 1;
}


function flipAndOverlay(sharpBaseImg, sharpOverlay) {
   return sharpBaseImg.overlayWith(sharpOverlay.flip().toBuffer())
}

function negateAndOverlay(sharpBaseImg, sharpOverlay) {
   return sharpBaseImg.overlayWith(sharpOverlay.negate().toBuffer())
}

function negateAndOverlay(sharpBaseImg, sharpOverlay) {
   return sharpBaseImg.overlayWith(sharpOverlay.negate().toBuffer())
}

function blurAndOverlay(sharpBaseImg, sharpOverlay) {
   return sharpBaseImg.overlayWith(sharpOverlay.blur(20).toBuffer())
}

function thresholdAndOverlay(sharpBaseImg, sharpOverlay) {
   return sharpBaseImg.overlayWith(sharpOverlay.threshold().toBuffer())
}

function carve(sharpBaseImg, sharpOverlay) {
   return sharpBaseImg.overlayWith(sharpOverlay, {
      cutout: true
   })
}


exports.convertPNG = convertPNG;
exports.setup = setup;
exports.doHorizOperation = doHorizOperation;