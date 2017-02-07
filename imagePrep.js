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
	console.log("about to load base file");

	const base = sharp('./tmp/color.png').raw().toBuffer();

	console.log("about to start compositing");

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


exports.convertPNG = convertPNG;

exports.setup = setup;
exports.compositeTest = compositeTest;
