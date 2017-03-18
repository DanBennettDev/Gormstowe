

// set upload location on form based on current position
// locX and locY must be declared in the page
// (these are set server side) 

var loc = LocationActions();

addEventListener('load', loc.init);


function LocationActions(){
	"use strict"
	LocationActions.init = init;
	LocationActions.setUploadAction = setUploadAction;


	var action;

	function init(){
		setUploadAction();
	}

	function setUploadAction(){
		action = '/upload&x='+ locX.toFixed(2) + ',y='+locY.toFixed(2);
		document.getElementById("upload_form").action = action;
	}

	return LocationActions;

}
