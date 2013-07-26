/*
	USAGE: 
		<script src="keyboard-nav.js"></script>
		<a data-keypress="37" href="{url}">Next Page</a>

	Details:
		Finds any anchor links with matching keyCode. Sets window.location to its href.

*/

Y.use('node', 'key-event', function(Y) {
  Y.on('domready', function() {

    // Keyboard navigation
    Y.on('keydown', function(event) {
      var targetLink = Y.one('a[data-keypress="'+event.keyCode+'"]');
      if (targetLink) {
        event.preventDefault();
        window.location.href = targetLink.getAttribute('href');
      }
    });

  });
});
