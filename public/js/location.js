

// set upload location on form based on current position
// locX and locY must be declared in the page and are set server side 

var loc = LocationActions();

addEventListener('load', loc.init);


function LocationActions(){
	"use strict"
	LocationActions.init = init;
	LocationActions.setUploadAction = setUploadAction;

	const 	placesBeforeDecimal = 3,
			placesAfterDecimal = 2,
			displayW = 10,
			displayH = 10;

	var action, locXFine, locYFine;

	function init(){
		locXFine = locX;
		locYFine = locY;
		setUploadAction();

		document.getElementById("locationClicker")
			.addEventListener("click", handleDisplayClick, false);

		document.getElementById("closeMenu")
			.addEventListener("click", hideMenu, false);

		addEventListener("keydown", handleKeyDown, false);
		addEventListener("keyup", handleKeyUp, false);
	}


	// more trouble, but doing this here because shortly I'll want to be 
	// able to move about the map client side changing location without 
	// (immediately) going back to server
	function setUploadAction(){
		action = buildLocationURL('upload',locXFine, locYFine, displayW, displayH);
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
			return valParts[0]+'.'+valParts[1]+'0'.repeat(padby);
		}
		return valParts[0]+'.'+valParts[1];

	}

	function handleKeyDown(event){
		if (event.keyCode == 17){// ctrlKey
			document.getElementById("locationClicker").style.zIndex = 100;
			document.body.style.cursor = "crosshair";
		} 
	}

	function handleKeyUp(event){
		if (event.keyCode == 17){// ctrlKey
			document.getElementById("locationClicker").style.zIndex = -100;
			document.body.style.cursor = "default";
		} 
	}


	function displayMenu(x,y){
		document.getElementById("upload").style.zIndex = 150;
		document.getElementById("upload").style.top = y+"px";
		document.getElementById("upload").style.left = x+"px";
	}

	function hideMenu(){
		document.getElementById("upload").style.zIndex = -150;
	}

	// clicks on locationClicker
	function handleDisplayClick(event){
		var xClick = event.clientX/event.currentTarget.offsetWidth;
		var yClick = event.clientY/event.currentTarget.offsetHeight;
		xClick = (xClick-0.5)*10.0; //(scale to-5 to 5)
		yClick = (yClick-0.5)*10.0; 
		locXFine = locX+xClick;
		locYFine = locY+yClick;
		setUploadAction();	
		displayMenu(event.clientX,event.clientY)

	}


	return LocationActions;

}
