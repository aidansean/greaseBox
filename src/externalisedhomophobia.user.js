// ==UserScript==
// @name           externalisedHomophobia
// @namespace      http://www.aidansean.com
// @description    Open external links in a new window
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
var oldLinks = new Array() ;
var newLinks = new Array() ;
var counter = 0 ;
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
      var externalLink = document.createElement('span') ;
      externalLink.innerHTML = ' <a href="' + url + '" rel="external" style="color:crimson">+</a> ' ;
      
      // Save information in separate lists, so that the length of links remains static
      oldLinks[counter] = links[i] ;
      newLinks[counter] = externalLink ;
      counter++ ;
    }
  }
}
for(var i=0 ; i<oldLinks.length ; i++)
{
  if(oldLinks[i].parentNode.lastchild == oldLinks[i])
  {
    oldLinks[i].parentNode.appendChild(newLinks[i]);
  }
  else
  {
    oldLinks[i].parentNode.insertBefore(newLinks[i], oldLinks[i].nextSibling);
  }
}