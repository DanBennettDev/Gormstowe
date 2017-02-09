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


function compositeTest() {
   const options = {
      raw: {
         width: 400,
         height: 400,
         channels: 4
      }
   };
   const base = sharp('./tmp/color.png').raw().toBuffer();


   const composite = [
      './tmp/accent0.png',
      './tmp/accent1.png',
      './tmp/shading.png',
      './tmp/highlight.png',
      './tmp/lineart.png'
   ].reduce(function(input, overlay) {
      return input.then(function(data) {
         console.log("reducing");
         return sharp(data, options).overlayWith(overlay).raw().toBuffer();
      });
   }, base);

   console.log("about to output");

   composite.then(function(data) {
      // data contains the multi-composited image as raw pixel data
      console.log("outputting");
      sharp(data, options).png().toFile('./tmp/composite.png');
   });

}


// TODO  - make compatible with variable input channels
//       - make on and off settable
//       - make reverse work (channel order)
function doFlipAndOverlay(imageIn, imageOut) {
   //doStripOperation(imageIn, imageOut, 30, false, flipAndOverlay);

   sharp(imageIn).overlayWith(
    new Buffer([0, 0, 0, 0]),
    { tile: true, raw: { width: 1, height: 1, channels: 4 } }
  ).metadata(function(err, metadata) {
      width = metadata.width;
      height = metadata.height;
      channels = metadata.channels + 1;
   }).raw().toBuffer().then(function(buffer) {

      const buffCopy = Object.assign({}, buffer);

      for (var i = 0; i < (height); i += 1) {
         if (reverseRow(i, 4, 6)) {
            var start = rowStart(width, channels, i);
            var end = rowEnd(width, channels, i);
            for (var j = 0; j < (width * channels); j += 1) {
               //buffer[start + j] = buffCopy[end - j];
               buffer[start + j]=0;
            }
         }
      }

     sharp(buffer, {
         raw: {
            width: width,
            height: height,
            channels: channels
         }
      }).png().toFile(imageOut, function(cb) {
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

function reverseRow(rowNo, on, off) {
   return (rowNo % (on + off)) < on;
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

function doStripOperation(imageIn, imageOut, stripCount, isHoriz, operation) {
   // todo - convert to work with generated SVG, simpler, more flexible, single step
   const image = sharp(imageIn);
   console.log("marker 1");

   image.metadata()
      .then(function(metadata) {
         const options = {
            raw: {
               width: metadata.width,
               height: metadata.height,
               channels: metadata.channels
            }
         };
         console.log("channels: " + metadata.channels);

         console.log("marker 2");
         const base = image.raw().toBuffer();
         const stripW = isHoriz ? metadata.width : Math.floor(metadata.height / stripCount);
         const stripH = isHoriz ? Math.floor(metadata.width / stripCount) : metadata.height;
         const stripWOffset = isHoriz ? stripH * 2 : 0;
         const stripHOffset = isHoriz ? 0 : stripW * 2;
         var stripPosW = 0,
            stripPosH = 0;
         console.log("marker 3");

         const stripList = makeStrips(metadata.width,
               metadata.height,
               stripCount,
               isHoriz)
            .reduce(function(input, overlay) {
               console.log("reduce 1");
               return input.then(function(data) {
                  stripPosW += stripWOffset;
                  stripPosH += stripHOffset;
                  console.log("reduce 2");
                  return sharp(data, options)
                     .overlayWith(overlay, {
                        top: stripPosW,
                        left: stripPosH
                     })
                     .raw().toBuffer();
                  console.log("do we get here?");
               });
            }, base);

         stripList.then(function(data) {
            console.log("outputting");
            sharp(data, options).png().toFile(imageOut);
            //operation(image, sharp(data, options)).png().toFile(imageOut);
            console.log("promises complete");
         });
      });
   console.log("function exits");
}


function makeStrips(stripW, stripH, count, isHoriz) {
   console.log("makeStrips");
   const channels = 3;
   const rgbaPixel = 0x00000000;
   const canvas = Buffer.alloc(stripW * stripH * channels, rgbaPixel);
   const strip = sharp(canvas, {
      raw: {
         width: stripW,
         height: stripH,
         channels: channels
      }
   });

   count = Math.floor(count / 2); // an object for every other strip
   const stripList = [strip.toBuffer()]

   while (count-- > 1) {
      console.log("stripcount: " + count);
      stripList.push(strip.toBuffer());
   }
   return stripList;
}



exports.convertPNG = convertPNG;
exports.setup = setup;
exports.compositeTest = compositeTest;
exports.doFlipAndOverlay = doFlipAndOverlay;