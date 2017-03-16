var sql = require('sqlite3').verbose(),
	fs = require('fs');

var db;
var commands = {};

function setup(filename) {
	db = new sql.Database(filename, sql.OPEN_READWRITE, function(err) {
		if (err != null) console.log("db load error: " + err);
	});
	commands["createUser"] =  loadCommandSync('./db/fn_createUser.sql');
	commands["createItem"] =  loadCommandSync('./db/fn_addItem.sql');
	commands["tagItem"] =  loadCommandSync('./db/fn_tagItem.sql');
	commands["createTag"] =  loadCommandSync('./db/fn_createTag.sql');
	commands["getUserInfoName"] =  loadCommandSync('./db/fn_getUserInfo.sql');
	commands["getUserInfoID"] =  loadCommandSync('./db/fn_getUserInfo_id.sql');
	commands["getUserItemsName"] =  loadCommandSync('./db/fn_getUserItems.sql');
	commands["getUserItemsID"] =  loadCommandSync('./db/fn_getUserItems_id.sql');
	commands["getItemInfo"] =  loadCommandSync('./db/fn_getItemInfo.sql');
	commands["getItemTags"] =  loadCommandSync('./db/fn_getItemTags.sql');
	commands["getItemsWithTag"] =  loadCommandSync('./db/fn_getItemsWithTag.sql');
}

function createUser(name, email, pwrd, callback) {
	db.run(commands["createUser"], [name, email, pwrd], function(err) {
		if (err) console.log('createUser error: ' + err.message);
		if(callback){callback();}
	});
}

function createItem(details, callback) {
	if (details.$ownerID == null || details.$positionX == null 
		|| details.$positionY == null  || details.$name == null || 
		details.$fileURL == null 
		|| details.$functionType == null || details.$type == null) {
		console.log("required fields not entered");
		return;
	}

	if (details.$type == "image" &&
		(details.$image_Width == null || details.$image_Height == null)) {
		console.log("image details missing");
		return;
	}
	if (details.$type == "sound" && details.$sound_Length == null) {
		console.log("sound details missing");
	}
	details.$captionText = details.$captionText || '';

	db.run(commands["createItem"], details, function(err) {
		if (err) console.log('createItem error: ' + err.message);
		if(callback){callback();}
	});
}

function createTag(name, description, callback) {
	db.run(commands["createTag"], {
		$name: name,
		$description: description
	}, function(err) {
		if (err) console.log('createTag error: ' + err.message);
		if(callback){callback();}
	});
}

function tagItem(itemID, tagName, callback) {
	db.run(commands["tagItem"], {
		$itemID: itemID,
		$tagName: tagName
	}, function(err) {
		if (err) console.log('tagItem error: ' + err.message);
		if(callback){callback();}
	});
}

function getUserInfo(key, rowAction) {
	const runThis = typeof key == 'string' ? 
				commands["getUserInfoName"] : commands["getUserInfoID"];

	db.get(runThis, [key], function(err, row) {
		if (err) {
			console.log('getUserInfo error: ' + err.message);
		} else {
			rowAction(row);
		}
	});
}

function getItemInfo(id, rowAction) {
	db.get(commands["getItemInfo"], [id], function(err, row) {
		if (err) {
			console.log('getItemInfo error: ' + err.message);
		} else {
			rowAction(row);
		}
	});
}

function getUserItems(key, rowAction) {
	const runThis = typeof key == 'string' ?
					commands["getUserItemsName"] : commands["getUserItemsID"];

	db.all(runThis, [key], function(err, row) {
		if (err) {
			console.log('getUserItems error: ' + err.message);
		} else {
			rowAction(row);
		}
	});
}

function getItemTags(itemID, rowAction) {
	db.all(commands["getItemTags"], [itemID], function(err, row) {
		if (err) {
			console.log('getItemTags error: ' + err.message);
		} else {
			rowAction(row);
		}
	});
}

function getItemsWithTag(tagID, rowAction) {
	db.all(commands["getItemsWithTag"], [tagID], function(err, row) {
		if (err) {
			console.log('getItemsWithTag error: ' + err.message);
		} else {
			rowAction(row);
		}
	});
}

function getTags(rowAction) {
	db.all('select * from Tag;', [], function(err, row) {
		if (err) {
			console.log('getTags error: ' + err.message);
		} else {
			rowAction(row);
		}
	});
}

function serialize(func){
	db.serialize(func);
}


function test(filename) {
	db.serialize(function() {
		createUser("bert", "email@address.com", "cockdazzle");

		itemDetails = {
			$ownerID: 1,
			$positionX: 100,
			$positionY: 100,
			$name: "objectName",
			$captionText: "objectCaption",
			$fileURL: "url.png",
			$type: "image",
			$functionType: "field",
			$image_Width: 800,
			$image_Height: 600,
			$sound_Length: 0
		};
		createItem(itemDetails);
		createItem(itemDetails);
		createItem(itemDetails);


		createTag("angry", "something that is angry");
		createTag("fluffy", "something that is fluffy");

		getUserInfo("bert", function(returnData) {
			console.log("getUserInfo for bert:");
			console.log(returnData); 
		});

		getUserInfo(2, function(returnData) {
			console.log("getUserInfo for id2 (bert):");
			console.log(returnData);
		});

		getUserItems(1, function(returnData) {
			console.log("getUserItems for id1:");
			console.log(returnData);
		});

		getItemInfo(3, function(returnData) {
			console.log("getItemInfo for id3:");
			console.log(returnData);
		});

		tagItem(1, "angry");
		tagItem(1, "fluffy");

		getItemTags(1, function(returnData) {
			console.log("getItemTags for id1:");
			console.log(returnData);
		});

		getItemsWithTag(1, function(returnData) {
			console.log("itemsWithTag 1:");
			console.log(returnData);
		});

		getTags(function(returnData) {
			console.log("Tags:");
			console.log(returnData);
		});

	});
}


function loadCommandSync(filename) {
	// synchronous - only call on startup
	const out = fs.readFileSync(filename, 'utf8');
	if (out == null) throw 'could not find ' + filename;
	return out;
}

exports.setup = setup;
exports.test = test;
exports.createUser = createUser;
exports.createItem = createItem;
exports.createTag = createTag;
exports.tagItem = tagItem;
exports.getUserInfo = getUserInfo;
exports.getItemInfo = getItemInfo;
exports.getUserItems = getUserItems;
exports.getItemTags = getItemTags;
exports.getItemsWithTag = getItemsWithTag;
exports.getTags = getTags;
exports.serialize = serialize;
