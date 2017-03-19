

// set upload location on form based on current position
// locX and locY must be declared in the page
// (these are set server side) 

var loc = LocationActions();

addEventListener('load', loc.init);


function LocationActions(){
	"use strict"
	LocationActions.init = init;
	LocationActions.setUploadAction = setUploadAction;

	var placesBeforeDecimal = 3,
		placesAfterDecimal = 2,
		displayW = 10,
		displayH = 10;

	var action;

	function init(){
		setUploadAction();
	}


	// more trouble, but doing this here because shortly I'll want to be 
	// able to move about the map client side changing location without 
	// (immediately) going back to server
	function setUploadAction(){
		action = buildLocationURL('upload',locX, locY, displayW, displayH);
		// action = '/upload&x='+ locX.toFixed(2) + ',y='+locY.toFixed(2);
		document.getElementById("upload_form").action = action;
	}


	// code repetition, but I need the same function in nodeJS and client side
	// so hard to see how to avoid this
	function buildLocationURL(action, x, y, w, h){
		var xPad = valToPaddedString(x);
		var yPad = valToPaddedString(y);
		var wPad = valToPaddedString(w);
		var hPad = valToPaddedString(h);

		return "/" + action + '&x=' + xPad + 
			',y=' + yPad +',w=' + wPad + ',h='+hPad; 
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

	return LocationActions;

}
