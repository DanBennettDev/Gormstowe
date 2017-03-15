
// code for the front page actions

var logoAnim = new svg_element_switcher("logo", "./img/text_viisit_frag_bak.svg");
var utility = Utility();
var frontpage = Frontpage()

var ghostTimer;
var ghosts = [], 
	fadeOuts = [];

addEventListener('load', frontpage.init);




function Frontpage(){
	"use strict"
	Frontpage.init = init;

	function init() {
		"use strict"
		ghosts = document.getElementsByClassName('ghost');
		fadeOuts = document.getElementsByClassName('fadeOut');
		utility.generateRepeatingText("slidingText1");
		utility.generateRepeatingText("slidingText2");
		utility.generateRepeatingText("slidingText3");
		utility.generateRepeatingText("slidingText4");
		utility.generateRepeatingText("slidingText5");

		logoAnim.run();
		var logo = document.getElementById('logo');
		logo.addEventListener('click', doFade, false);
		logo.style.cursor ="pointer"; // indicate click will have navigation result


		function doFade() {
			logo.removeEventListener('click', doFade, false);
			logo.style.cursor ="auto"; // indicate further clicks do nothing
			// logo animation is too much of a focal point, remove to allow focus to shift to cars as they fade in
			// but delay until it appears zooming screen has covered it
			setTimeout(logoAnim.off, 400);
			utility.doZoomFade(ghosts, fadeOuts, 6, displayMenu); // display menu again once fade is complete
			utility.doJitter(ghosts, 10, 0.1, 4);
		}

		function displayMenu(){
			document.getElementById('middleMenu').style.visibility = "visible";
			logo.style.visibility = "visible";
			logoAnim.startAnim();

		}

	}




	return Frontpage;
}