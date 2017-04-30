
// Image processing functions for the site

var sharp = require("sharp");
var globals = require("./globals")



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


function processImage(fileIn, fileOut, onRows, offRows, options, callback)
{
   convertPNG(fileIn, fileOut, processChain);
   function processChain() {
      console.log("start process");
      sharp(fileOut).overlayWith(
         //guarantee 4 layer png
         new Buffer([0, 0, 0, 0]),
         { tile: true, raw: { width: 1, height: 1, channels: 4 } }
     ).metadata( function(err, metadata) {
         width = metadata.width;
         height = metadata.height;
         channels = 4;  // guaranteed by overlaywith above
      }).raw().toBuffer(venetianBlinds);
   }

   function venetianBlinds(error, buffer, info) {
      console.log("start venetian");

      if(error){
         console.log(error);
         return;
      }

      if(options & globals.imgProcessVenetianOn){
         const buffCopy = Object.assign({}, buffer);
         const rowCycle = onRows + offRows;
         console.log(channels);
         for (var i = 0; i < (height); i += 1) {
            if (i % rowCycle < onRows) {
               var start = rowStart(width, channels, i);
               var end = rowEnd(width, channels, i);
               for (var j = 0; j < (width * channels); j += channels) {
                  // set alpha channel to 0
                   buffer[start + j + channels -1]=0;
               }
            }
         }
      }
      rotate(buffer);
   }

   function rotate(buffer){
      if(options & globals.imgProcessRotateOn){
         var rotateAmt = Math.random() > 0.5 ? 90 : 270;
         sharp(buffer, {
         raw: {
            width: width,
            height: height,
            channels: channels
         }
      }).rotate(rotateAmt).toBuffer(colourise);
      } else {
         sharp(buffer).toBuffer(colourise);
      }
   }

   function colourise(error, buffer, info){
      if(options & globals.imgProcessColouriseOn){
         // to be implemented
         toFile(buffer, info);
      }

      toFile(buffer, info);
   }

   function toFile(buffer, info){
        sharp(buffer, {
         raw: {
            width: info.width,
            height: info.height,     
            // implement later - option to glitch - rotating wrongly sized buffer gives interesting results    
            // width: glitchMode ? width : info.width,
            // height: glitchMode ? height : info.height,
            channels: channels
         }
      }).png().toFile(fileOut, function(err, info) {
         if(callback){
            callback(err, info);
         }

      });
   }
}





function rowStart(width, channels, rowNo) {
   return width * channels * rowNo;
}

function rowEnd(width, channels, rowNo) {
   return (width * channels * rowNo) + (width * channels) - 1;
}


// placeholders, not used at the moment - modifications to venetian blind operation
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
exports.processImage = processImage;