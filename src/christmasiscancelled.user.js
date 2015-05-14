// ==UserScript==
// @name           ChristmasIsCancelled
// @namespace      http://www.aidansean.com
// @description    Removes any threads with "Christmas" in the title
// @include        http*://*thingbox.com/*
// @include        http*://*myofficebox.com/*
// ==/UserScript==

var links = document.getElementsByTagName('a') ;
for(var i=0 ; i<links.length ; i++)
{
  if(links[i].href.match('thread/232828')) continue ;
  var text = links[i].innerHTML.toLowerCase() ;
  if(  text.match('christmas')!=null
    || text.match('xmas')!=null
    || text.match('chrimbo')!=null
  )
  {
    links[i].parentNode.style.display = 'none' ;
  }
}