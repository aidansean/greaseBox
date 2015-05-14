// ==UserScript==
// @name           externalisedHomophobia2
// @namespace      http://www.aidansean.com
// @description    Changes existing external links to open in a new window
// @include        http://www.thingbox.com/*
// ==/UserScript==

// Append scripts to head
var head = document.getElementsByTagName('head')[0] ;
var script_links = document.createElement('script') ;
script_links.type = 'text/javascript' ;
script_links.innerHTML = 'function externalLinks()\n{\nif(!document.getElementsByTagName)return;\nvar anchors=document.getElementsByTagName("a");\nfor(var i=0; i<anchors.length; i++)\n{\nvar anchor = anchors[i];\nif(anchor.getAttribute("href") && ( anchor.getAttribute("rel") == "external" || anchor.getAttribute("rel") == "external nofollow" || anchor.getAttribute("rel") == "nofollow external" )) anchor.target = "_blank";\n}\n}' ;
var script_load = document.createElement('script') ;
script_load.type = 'text/javascript' ;
script_load.innerHTML = 'window.onload = function(){externalLinks();}' ;
head.appendChild(script_links) ;
head.appendChild(script_load) ;

// Search through all links on the page
var links = document.getElementsByTagName('a') ;
for(var i=0 ; i<links.length ; i++)
{
  var url = links[i].href ;
  // Look for links that appear to point to external websites
  if(url.match('http'))
  {
    // Exclude links to thingbox and myofficebox
    if(
      !url.match('http://thingbox.com') && 
      !url.match('http://myofficebox.com') && 
      !url.match('https://thingbox.com') && 
      !url.match('https://myofficebox.com') && 
      !url.match('http://www.thingbox.com') && 
      !url.match('https://www.thingbox.com') && 
      !url.match('http://www.myofficebox.com') && 
      !url.match('https://www.myofficebox.com')
    )
    {
      links[i].style.color = 'crimson' ;
      links[i].rel = 'external' ;
    }
  }
}