// loads an SVG file to the indicated div and 
// randomly switches on and off 
// visibility of any elements of class "onoff"


function svg_element_switcher(div, svgURL) {
	"use strict"

	svg_element_switcher.run = run;
	svg_element_switcher.startAnim = startAnim;
	svg_element_switcher.off = off;
	svg_element_switcher.on = on;


	var onoffList = [];
	var frameCount = 0;
	var probabilityOneOff = 0.4;
	var probabilityAllOff = 0.001;
	var probabilityAllOn = 0.01;
	var probabilityPause = 0.0;
	var pauseCount = 50;
	var pauseCounter = 0;
	var rate = 100;
	var elementsOff = 0;
	var timer;

	function run() {
		// load SVG into DOM so we can manipulate it, 
		// can't manipulate svg if loaded image-style, as file (it seems!?) 
		var delay = d3.xml(svgURL).mimeType("image/svg+xml")
			.get(function(error, xml) {
				if (error) throw error;
				d3.select("#" + div)
					.node()
					.appendChild(xml.documentElement);

				startAnim();
			});
	}

		function step() {
			if (pauseCounter >= pauseCount) {
				pauseCount++;
				return;
			}
			var thisRandom = Math.random();
			if (thisRandom < probabilityAllOff) {
				hideAll();
			} else if (thisRandom < probabilityAllOn) {
				for (var elem of onoffList) {
					elem.style.visibility = "visible"
					elementsOff = 0;
				}
			} else if (thisRandom < probabilityPause) {
				pauseCount = 0;

			} else if (thisRandom < probabilityOneOff) {
				var elem = Math.floor(Math.random() * onoffList.length);
				if (onoffList[elem].style.visibility == "hidden") {
					elementsOff--;
					onoffList[elem].style.visibility = "visible";
				} else {
					if (thisRandom < (probabilityOneOff / (elementsOff + 1))) {
						elementsOff++;
						onoffList[elem].style.visibility = "hidden";
					}
				}
			}
		}	

	function startAnim() {
		onoffList = document.getElementById(div)
			.getElementsByClassName("onoff");
		timer = setInterval(step, rate);
	}

	function hideAll() {
		for (var elem of onoffList) {
			elem.style.visibility = "hidden"
			elementsOff = onoffList.length;
		}
	}

	function showAll() {
		for (var elem of onoffList) {
			elem.style.visibility = "visible"
			elementsOff = onoffList.length;
		}
	}

	function off() {
		clearInterval(timer);
		hideAll();
	}

	function on() {
		clearInterval(timer);
		showAll();
	}



	return svg_element_switcher;
}