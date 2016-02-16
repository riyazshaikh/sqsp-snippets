/** 
    USAGE: Add code below as a bookmarklet, then click on it whenever you need info about a site.
    javascript:javascript:if(!window.Squarespace){alert("Not a Squarespace website")}else if(window.Squarespace.Constants){alert("Squarespace 5 website")}else Y.use("io","node",function(e){e.io("/site.css?debug=true",{on:{success:function(e,t){var n,a="\nSquarespace Website\n";a+=Static.SQUARESPACE_CONTEXT.website.authenticUrl+"\n",n=t.responseText.match(new RegExp("templateWebsite\\(ownerWebsiteId\\): (.*)")),a+="\nTemplate: "+(n?n[1]:"Unknown")+(Static.SQUARESPACE_CONTEXT.website.developerMode?" (Developer Site)":""),a+="\nFeatures: "+(t.responseText.match(new RegExp("website custom css"))?String.fromCharCode(10004)+" Custom CSS":String.fromCharCode(10008)+" Custom CSS")+"\n"+(Static.SQUARESPACE_CONTEXT.website.developerMode?String.fromCharCode(10004)+" Developer":String.fromCharCode(10008)+" Developer")+"\n"+(Static.SQUARESPACE_CONTEXT.websiteSettings.storeSettings.isLive?String.fromCharCode(10004)+" Commerce":String.fromCharCode(10008)+" Commerce"),a+="\nLast Updated: "+new Date(Static.SQUARESPACE_CONTEXT.website.contentModifiedOn).toLocaleDateString(),createdOnMatch=t.responseText.match(new RegExp('"createdOn":[^,}]*')),createdOnMatch=createdOnMatch[0].replace('"createdOn":',""),a+="\nDate Created: "+new Date(parseInt(createdOnMatch,10)).toLocaleDateString(),a+="\nLocation: "+Static.SQUARESPACE_CONTEXT.website.timeZone,window.location.hostname.match(/squarespace.com/)||(a+="\nIdentifier: "+Static.SQUARESPACE_CONTEXT.website.identifier),alert(a)}}})});
**/

if(!window.Squarespace){
    alert("Not a Squarespace website")l
} else if (Squarespace.Constants) {
    alert('Squarespace 5 website');
} else {
    // If Sqsp 6 website
    Y.io('/site.css?debug=true', {
      on: {
        success: function(result, response) {
          var matches, output = "Squarespace 6 website";

          matches = response.responseText.match(new RegExp('templateWebsite\\(ownerWebsiteId\\): (.*)'));
          
          output += "\nTemplate : " + (matches ? matches[1] : 'Unknown');

          output += "\nCustom CSS : " + (response.responseText.match(new RegExp('Custom CSS')) ? 'Yes' : 'No');
          
          output += "\nDeveloper Site : " + (Static.SQUARESPACE_CONTEXT.website.developerMode ? 'Yes' : 'No');

          if( !window.location.hostname.match(/squarespace.com/) ) {
            output += "\nIdentifier : " + Static.SQUARESPACE_CONTEXT.website.identifier;
          }
          alert(output);
        }
      }
    });
}
