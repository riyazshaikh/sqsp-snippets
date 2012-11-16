/** 
    USAGE: Add code below as a bookmarklet, then click on it whenever you need info about a site.
    javascript:if(!window.Squarespace){alert("Not a Squarespace website")}else if(window.Squarespace.Constants){alert("Squarespace 5 website")}else{Y.Get.js("//code-snippets.squarespace.com/scripts/site-info.js?"+(new Date).getTime())}
**/


Y.use('io', function(Y) {
  // SQS 5 site
  if (Squarespace.Constants) {
    alert('Squarespace 5 website');
    // dont have any other info yet
  } else {
    // If Sqsp 6 website
    Y.io('/site.css?debug=true', {
      on: {
        success: function(result, response) {
          var template, customCss, devMode, matches;

          matches = response.responseText.match(new RegExp('ownerWebsite: (.*)'));
          
          template = matches ? matches[1] : 'Unknown';

          customCSS = response.responseText.match(new RegExp('Custom CSS')) ? 'Yes' : 'No';
          
          devMode = Static.SQUARESPACE_CONTEXT.website.developerMode ? 'Yes' : 'No';

          alert("Squarespace 6 website" + "\nTemplate : " + template + "\nCustom CSS : " + customCSS + "\nDeveloper Site : " + devMode);
        }
      }
    });
  }
});



