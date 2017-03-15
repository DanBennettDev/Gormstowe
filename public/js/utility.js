/* (potentially) reusable functions for the site */


function Utility() {
	"use strict"
	Utility.randomWalker = randomWalker;
	Utility.doZoomFade = doZoomFade;
	Utility.doJitter = doJitter;
	Utility.generateRepeatingText = generateRepeatingText;

	var animInterval = 40;

	function getStepSize(time) {
		return animInterval / (1000 * time);
	}

	function doZoomFade(fadeIns, fadeOuts, time, callback) {
		var fadeStep = getStepSize(time);
		var halfPI = Math.PI / 2.0;
		var lin = 0,
			op = 0;
		var heightPersist = 70; 
		var multiplier = 1.001;
		ghostTimer = setInterval(doFadeStep, animInterval);

		function doFadeStep() {
			multiplier *= multiplier;
			if (lin >= 1.0) {
				lin = 1.0;
				clearInterval(ghostTimer);
				callback();
			}
			op = Math.sin(lin * halfPI);
			op = op*op*op; // ease transition
			for (var ghost of ghosts) {
				ghost.style.opacity = op;
				ghost.style.filter = 'alpha(opacity=' + op * 100 + ")";
			}
			for (var fadeOut of fadeOuts) {
				fadeOut.style.opacity = 1 - op;
				fadeOut.style.filter = 'alpha(opacity=' + (1 - op) * 100 + ")";
				fadeOut.style.height = heightPersist +"vh";
				fadeOut.style.maxHeight = heightPersist +"vh";
				heightPersist*=multiplier;
			}

			lin += fadeStep;
		}
	}


	function doJitter(elements, time, minStep, maxStep) {

		var walkers = [];
		var timeStep = getStepSize(time);
		var stepRange = maxStep - minStep;
		var counter = 0;

		for (var elem of elements) {
			walkers.push(randomWalker(minStep));
		}
		setInterval(doJitterStep, animInterval);

		function doJitterStep() {
			var thisStep = (counter * counter * counter * stepRange) + minStep;

			for (var i = 0; i < elements.length; i++) {
				var newpos = walkers[i].newval();
				elements[i].style.left = newpos[0];
				elements[i].style.top = newpos[1];
				walkers[i].setStep(thisStep);
			}
			if (counter < 1.0) {
				counter += timeStep;
			}
		}

	}

	function generateRepeatingText(div){
		var rows = 8;
		var lineLength = 100;
		var unit1 = "/..";
		var unit2 = "..\\"
		var oddLine, evenLine, content;

		oddLine = evenLine = "<p>";
		oddLine+= unit1.repeat(lineLength/unit1.length);
		evenLine+= unit2.repeat(lineLength/unit1.length);
		oddLine+= "</p>";
		evenLine+= "</p>";
		content = "";
		for(var i=0; i< rows; i++){
			if(i%2==0){
				content+=evenLine;
			} else {
				content+=oddLine;
			}
		}

		document.getElementById(div).innerHTML=content;

	}





	function randomWalker(step) {
		randomWalker.newval = newval;
		randomWalker.getStep = getStep;
		randomWalker.setStep = setStep;

		var _step = step;
		var pos = [0, 0];

		function newval() {
			pos[0] += getRandom();
			pos[1] += getRandom();

			if (pos[0] < 0.0) {
				pos[0] = 0.0;
			}
			if (pos[1] < 0.0) {
				pos[1] = 0.0;
			}
			if (pos[0] > 1.0) {
				pos[0] = 1.0;
			}
			if (pos[1] > 1.0) {
				pos[1] = 1.0;
			}

			var out = [pos[0] * 20.0 + "px",
				pos[1] * 20.0 + "px"
			];

			return out;
		}

		function setStep(val) {
			_step = val;
		}

		function getStep() {
			return _step;
		}

		function getRandom() {
			return (Math.random() * _step) - (_step / 2.0);

		}

		return randomWalker;
	}


	return Utility;
}
