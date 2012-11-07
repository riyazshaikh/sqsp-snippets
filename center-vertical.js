/* 
	USAGE:
	<script src="center-vertical.js"></script>
	<a class="center-vertical">Centered Content</a>
	
	Details:
	Add "center-vertical" class to an element to center it with respect to parent
	Adjusts marginTop to position content halfway between parent height.
*/
var findNCenter = function() {
  var elems = document.querySelectorAll('.center-vertical');

  for(var i =0; i<elems.length; i++) {
    elems[i].style.marginTop = (elems[i].parentNode.offsetHeight - elems[i].offsetHeight)/2 + 'px';
  }
};

document.addEventListener && document.addEventListener('DOMContentLoaded', findNCenter);
window.addEventListener && window.addEventListener('resize', findNCenter);
