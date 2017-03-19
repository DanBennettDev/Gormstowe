// author: Dan Bennett
// functions to parse requests with parameters
"use strict"

var querystring = require("querystring"),
	fs = require("fs"),
	url = require("url");

var placesBeforeDecimal = 3;
var placesAfterDecimal = 2;


function getAction(request){
	var requestAction = url.parse(request.url).pathname;
}

function getParamString(request){
	var requestAction = url.parse(request.url).pathname;
	var paramStart = requestAction.indexOf("&");
	if(paramStart==-1){
		console.log("error - no parameters in location request")
		return;
	}
	return requestAction.substring(paramStart,requestAction.length+1);
}

function getParam(paramString, part){
	var partLen = part.length;
	return paramString
		.substring(paramString.indexOf(part)+1+partLen, 
			paramString.indexOf(part)+2+partLen+ placesBeforeDecimal+placesAfterDecimal);
}

function buildLocationURL(action, x, y){
	var xPad = valToPaddedString(x);
	var yPad = valToPaddedString(y);

	return "/" + action + '&x=' + xPad + 
		',y=' + yPad; 
}

function valToPaddedString(val){
	var valParts = val.toString().split(".",2);

	// pad out to correct places before decimal
	if(valParts[0].length>placesBeforeDecimal){
		valParts[0]='9'.repeat(placesBeforeDecimal);
	}
	valParts[0] = 
		'0'.repeat(placesBeforeDecimal-valParts[0].length)
			+valParts[0];

	if(valParts.length==1){
		return valParts[0]+'.'+ '0'.repeat(placesAfterDecimal);
	}
	// pad out to 2 places after decimal
	valParts[1] =  valParts[1].substring(0,placesAfterDecimal);
	if(valParts[1].length<placesAfterDecimal){
		var padby = placesAfterDecimal - valParts[1].length;
		return valparts[0]+'.'+valparts[1]+'0'.repeat(padby);
	}
	return valparts[0]+'.'+valparts[1];

}



exports.getAction = getAction;
exports.getParamString = getParamString;
exports.getParam = getParam;
exports.buildLocationURL = buildLocationURL;