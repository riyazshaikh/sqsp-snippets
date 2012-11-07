/*
	USAGE: 
		<script src="jquery.js"></script>
		<script src="keyboard-nav.js"></script>
		<a data-keypress="37" href="{url}">Next Page</a>

	Details:
		Finds any anchor links with matching keyCode. Sets window.location to its href.

	TODO: Convert to YUI
*/

// Navigate on key left/right
$(document).keydown(function(e) {

	var targetLink = $('a[data-keypress="'+e.keyCode+'"]');
	if( targetLink.length ) {
		e.preventDefault();
		window.location.href = targetLink.attr('href');
	}

});