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
      AddRemove.removeElements(300);
      colorClasses();
   }

   function colorClasses(){
      const candidates = document.querySelectorAll('.mobileElement');
      for (var elem of candidates) {
         console.log(elem.id.split("_")[1] % 3);
         if(parseInt(elem.id.split("_")[1]) % 3 == 0){
            elem.className = 'prettyElement1';
         } else if (parseInt(elem.id.split("_")[1]) % 2 == 0){
            elem.className = 'prettyElement2';
         }
      }
   }


   //document.getElementById("adder").addEventListener("click", AddRemove.testAddElements(4));

   // add loads by holding down longer
   document.getElementById("adder").addEventListener("mousedown", startCount);
   document.getElementById("adder").addEventListener("mouseup", endCount);

   document.getElementById("remover").addEventListener("click", removeElements);
}