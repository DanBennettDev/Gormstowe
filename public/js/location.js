// set upload location on form based on current position
// locX and locY must be declared in the page and are set server side 

var loc = LocationActions();

addEventListener('load', loc.init);


function LocationActions() {
	"use strict"
	LocationActions.init = init;
	LocationActions.setUploadAction = setUploadAction;
	LocationActions.showCaption = showCaption;
	LocationActions.closeCaption = closeCaption;
	LocationActions.closeHelp = closeHelp;
	LocationActions.showHelp = showHelp;


	const placesBeforeDecimal = 3,
		placesAfterDecimal = 2,
		displayW = 10,
		displayH = 10,
		navOffset = 2.5,
		maxW = 100,
		maxH = 100,
		venetianOnVal=4,
		rotateOnVal=2,
		colouriseOnVal=1;


	var action, locXFine, locYFine;

	function init() {
		locXFine = locX;
		locYFine = locY;
		setUploadAction();
		setNavLinks();
		if (help) {
			showHelp();
		}

		document.getElementById("locationClicker")
			.addEventListener("click", handleDisplayClick, false);

		document.getElementById("closeMenu")
			.addEventListener("click", hideMenu, false);

		document.getElementById("closeHelp")
			.addEventListener("click", closeHelp, false);

		addEventListener("keydown", handleKeyDown, false);
		addEventListener("keyup", handleKeyUp, false);

		document.getElementById("functionType")
			.addEventListener("click", showHideMenuElements, false);

	}


	// it's more trouble to do so, but I'm doing this here because shortly I'll want to be 
	// able to buffer areas larger than the screen area and about the map client side, 
	// changing location independently of (AJAX) calls back to server
	function setUploadAction() {
		action = buildLocationURL('upload', locXFine, locYFine, displayW, displayH);
		// action = '/upload&x='+ locX.toFixed(2) + ',y='+locY.toFixed(2);
		document.getElementById("upload_form").action = action;
	}

	function setNavLinks() {
		document.getElementById('navNorth').href =
			buildLocationURL('location', locXFine, locYFine - navOffset, displayW, displayH);
		document.getElementById('navSouth').href =
			buildLocationURL('location', locXFine, locYFine + navOffset, displayW, displayH);
		document.getElementById('navEast').href =
			buildLocationURL('location', locXFine + navOffset, locYFine, displayW, displayH);
		document.getElementById('navWest').href =
			buildLocationURL('location', locXFine - navOffset, locYFine, displayW, displayH);
	}



	// code repetition, but I need the same function in nodeJS and client side
	// so hard to see how to avoid this
	function buildLocationURL(action, x, y, w, h) {
		// limiting user to map client side to allow people to hack it if they want to
		// I actually kind of like the idea of someone making a hidden bit. 
		x = x < 0 ? 0 : x;
		x = x > maxW ? maxW : x;
		y = y < 0 ? 0 : y;
		y = y > maxH ? maxH : y;

		var xPad = valToPaddedString(x);
		var yPad = valToPaddedString(y);
		var wPad = valToPaddedString(w);
		var hPad = valToPaddedString(h);

		return "/" + action + '&x=' + xPad +
			',y=' + yPad + ',w=' + wPad + ',h=' + hPad;
	}


	function valToPaddedString(val) {
		var valParts = val.toString().split(".", 2);

		// pad out to correct places before decimal
		if (valParts[0].length > placesBeforeDecimal) {
			valParts[0] = '9'.repeat(placesBeforeDecimal);
		}
		valParts[0] =
			'0'.repeat(placesBeforeDecimal - valParts[0].length) + valParts[0];

		if (valParts.length == 1) {
			return valParts[0] + '.' + '0'.repeat(placesAfterDecimal);
		}
		// pad out to 2 places after decimal
		valParts[1] = valParts[1].substring(0, placesAfterDecimal);
		if (valParts[1].length < placesAfterDecimal) {
			var padby = placesAfterDecimal - valParts[1].length;
			return valParts[0] + '.' + valParts[1] + '0'.repeat(padby);
		}
		return valParts[0] + '.' + valParts[1];

	}

	function handleKeyDown(event) {
		if (event.keyCode == 17) { // ctrlKey
			document.getElementById("locationClicker").style.zIndex = 100;
			document.body.style.cursor = "crosshair";
		}
	}

	function handleKeyUp(event) {
		if (event.keyCode == 17) { // ctrlKey
			document.getElementById("locationClicker").style.zIndex = -100;
			document.body.style.cursor = "default";
		}
	}


	function displayMenu(x, y) {
		document.getElementById("upload").style.zIndex = 150;
		var marker = document.getElementById("uploadMarker");
		marker.style.zIndex = 150;
		marker.style.top = y + "px";
		marker.style.left = x + "px";
	}

	function hideMenu() {
		document.getElementById("upload").style.zIndex = -150;
		document.getElementById("uploadMarker").style.zIndex = -150;

	}

	function showCaption(idNo) {
		document.getElementById("caption" + idNo).style.zIndex = 150;
		document.getElementById("caption" + idNo).style.visibility = "visible";
		document.getElementById("captionLink" + idNo).style.zIndex = -150;
		document.getElementById("captionLink" + idNo).style.visibility = "hidden";
	}

	function closeCaption(idNo) {
		document.getElementById("captionLink" + idNo).style.zIndex = 150;
		document.getElementById("captionLink" + idNo).style.visibility = "visible";
		document.getElementById("caption" + idNo).style.zIndex = -150;
		document.getElementById("caption" + idNo).style.visibility = "hidden";
	}

	function showHelp() {
		document.getElementById("help").style.zIndex = 150;
		document.getElementById("help").style.visibility = "visible";
	}

	function closeHelp() {
		document.getElementById("help").style.zIndex = -150;
		document.getElementById("help").style.visibility = "hidden";
	}

	function showHideMenuElements(){
		var optBox = document.getElementById("functionType");
		var selected = optBox.options[optBox.selectedIndex].value;

		if(selected=="texture"){
			console.log("trigger");
			document.getElementById("textureOptions").style.display = "inline";
			document.getElementById("objectOptions").style.display = "none";
		} else {
			document.getElementById("textureOptions").style.display = "none";
			document.getElementById("objectOptions").style.display = "inline";
		}
	}


	// clicks on locationClicker
	function handleDisplayClick(event) {
		var xClick = event.clientX / event.currentTarget.offsetWidth;
		var yClick = event.clientY / event.currentTarget.offsetHeight;
		xClick = (xClick - 0.5) * 10.0; //(scale to-5 to 5)
		yClick = (yClick - 0.5) * 10.0;
		locXFine = locX + xClick;
		locYFine = locY + yClick;
		setUploadAction();
		displayMenu(event.clientX, event.clientY)

	}



	return LocationActions;

}