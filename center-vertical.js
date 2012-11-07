/* 
	Usage:
	Add "center-vertical" class to an element to center it with respect to parent
*/
var findNCenter = function() {
  var elems = document.querySelectorAll('.center-vertical');

  for(var i =0; i<elems.length; i++) {
    elems[i].style.marginTop = (elems[i].parentNode.offsetHeight - elems[i].offsetHeight)/2 + 'px';
  }
};

document.addEventListener && document.addEventListener('DOMContentLoaded', findNCenter);
window.addEventListener && window.addEventListener('resize', findNCenter);
