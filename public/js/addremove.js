function AddRemove() {
   "use strict"

   //addEventListener('load', start);

   AddRemove.addElements = addElements;
   AddRemove.removeElements = removeElements;
   AddRemove.testAddElements = testAddElements;
   

   var currID = 0;
   testAddElements(4);

   function start() {
      // TESTING - don't do this normally
   }


   // change this to get its element list from an url
   function addElements(parent, elementList, category) {
      // add all to a fragment first to speed up insert
      var fragment = document.createDocumentFragment();
      for (var element of elementList) {
         // check top level node of element is a div
         if (element.firstChild.tagName != 'div')
            console.log('addElements error: top element of fragment is not a div, is ' + element.firstChild.tagName);

            // set the ID of the DIV
         element.firstChild.setAttribute('ID', category + '_' + currID);
         element.firstChild.setAttribute('xPos', currID);
         element.firstChild.setAttribute('yPos', currID);
         element.firstChild.className += category;

         // set coordinates of object (use "data-..." attributes) // actually assume it'll have these
         // append to fragment
         fragment.appendChild(element)
         currID++;
      }
      // append fragment to DOM
      parent.appendChild(fragment.cloneNode(true));
   }

   //TODO: remove this function, source elements from AJAX GET
   function testAddElements(count){
      var elements = [];
      // create elements
      for (var id = 0; id < count; id++) {
         var thisElement = document.createDocumentFragment();
         var thisDiv = document.createElement("div");
         thisDiv.innerHTML = 'element_' + id;
         thisElement.appendChild(thisDiv);
         elements.push(thisElement);
      }
      addElements(document.body, elements, 'mobileElement')
   }

   //TODO: alter this to take x and y threshold to remove elements too
   // far out of browser window scope
   function removeElements(threshold) {
      const candidates = document.querySelectorAll('.mobileElement');
      // now remove elements
      for (var elem of candidates) {
         if (elem.getAttribute('xPos') > threshold) {
            elem.parentNode.removeChild(elem);
         }
      }
   }

   function logElement(description, element) {
      console.log(description + ':');
      console.log(element.innerHTML + '\n');
   }


}