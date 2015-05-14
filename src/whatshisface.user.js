// ==UserScript==
// @name           whatsHisFace
// @namespace      http://www.aidansean.com
// @include        http*://*thingbox.com/*
// @include        http*://*myofficebox.com/*
// ==/UserScript==

var links = document.getElementsByTagName('a') ;
var link ;
var member_id ;
for(var i=0 ; i<links.length ; i++)
{
  if(links[i].innerHTML.match('<img')) continue ;
  if(links[i].className!='profile') continue ;  
  member_id = links[i].href.split('/')[5] ;
  link = document.createElement('a') ;
  link.href = '/photos/folder/' + member_id + '/gallery' ;
  link.innerHTML = ' [G] ' ;
  links[i].parentNode.insertBefore(link, links[i].nextSibling) ;
}
