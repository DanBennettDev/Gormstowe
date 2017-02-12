
// author: Dan Bennett
// request handling...


var querystring = require("querystring"),
	fs = require("fs"),
	formidable = require("formidable");

var imageProcess;

function setup(imageProcessor){
	imageProcess = imageProcessor;

	//imageProcess.convertPNG("./tmp/rocks.jpg", "./tmp/rocks.png");

	imageProcess.doHorizOperation(	"./tmp/baboon2.png",
										"./tmp/baboozle.png",
										4, 4, true );
	}

function start(response, postData) {
	console.log("Request handler 'start' was called.");

	var body = '<html>' +
		'<head>' +
		'<meta http-equiv="Content-Type" ' +
		'content="text/html; charset=UTF-8" />' +
		'</head>' +
		'<body>' +
		'<form action="/upload" enctype="multipart/form-data" ' +
		'method="post">' +
		'<input type="file" name="upload">' +
		'<input type="submit" value="Upload file" />' +
		'</form>' +
		'</body>' +
		'</html>';

	response.writeHead(200, {
		"Content-Type": "text/html"
	});
	response.write(body);
	response.end();
}

function upload(response, request) {
	var form = new formidable.IncomingForm();
	form.parse(request, function(error, fields, files) {

		/* Possible error on Windows systems:
		tried to rename to an already existing file */
		// TODO: allow multiple files in use at once. Delete temp once done with
		fs.rename(files.upload.path, "/tmp/temp.png", function(error) {
			if (error) {
				fs.unlink("/tmp/temp.png");
				fs.rename(files.upload.path, "/tmp/temp.png");
			}
		});
		

		imageProcess.convertPNG("/tmp/temp.png", "/tmp/test.png", 
			function (err, info){ // callback: wait til image processed then show
				response.writeHead(200, {
					"Content-Type": "text/html"
				});
				response.write("received image:<br/>");
				response.write("<img src='/show' />");
				response.end();
			}
			);


	});
}

function show(response) {
	console.log("Request handler 'show' was called.");
	response.writeHead(200, {
		"Content-Type": "image/png"
	});
	fs.createReadStream("/tmp/test.png").pipe(response);
}

exports.setup = setup;
exports.start = start;
exports.upload = upload;
exports.show = show;