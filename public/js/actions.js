// sketchy test script. Not best practice

addEventListener('load', start);

function start() {
	AddRemove();

	var timer, elements;

	function startCount() {
		timer = Date.now();
	}

	function endCount() {
		elements = (Date.now() - timer) / 500;
		AddRemove.testAddElements(elements);
	}

	function removeElements(){
		AddRemove.removeElements(10)		
	}

	//document.getElementById("adder").addEventListener("click", AddRemove.testAddElements(4));

	// add loads by holding down longer
	document.getElementById("adder").addEventListener("mousedown", startCount);
	document.getElementById("adder").addEventListener("mouseup", endCount);

	document.getElementById("remover").addEventListener("click", removeElements);
}