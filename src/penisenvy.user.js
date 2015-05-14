// ==UserScript==
// @name           penisEnvy
// @namespace      http://www.aidansean.com
// @description    Replaces faces with cocks
// @include        http*://*thingbox.com/*
// @include        http*://*myofficebox.com/*
// ==/UserScript==

var divs = document.getElementsByTagName('div') ;
var imgs ;
for(var i=0 ; i<divs.length ; i++)
{
  if(divs[i].className=='thumb')
  {
    links = divs[i].getElementsByTagName('a') ;
    if(links[0].href.match('\/gallery\/')) continue ;
    imgs = divs[i].getElementsByTagName('img') ;
    imgs[0].src = 'http://www.aidansean.com/greasemonkey/cocks/' + (1+Math.floor(Math.random()*5)) + '_60.jpg' ;
  }
}

imgs = document.getElementsByTagName('img') ;
for(var i=0 ; i<divs.length ; i++)
{
  if(imgs[i].className=='headshot')
  {
    if(document.URL.match('account\/welcome'))
    {
      imgs[i].src = 'http://www.aidansean.com/greasemonkey/cocks/' + (1+Math.floor(Math.random()*5)) + '_60.jpg' ;
    }
    else
    {
      imgs[i].src = 'http://www.aidansean.com/greasemonkey/cocks/' + (1+Math.floor(Math.random()*5)) + '_30.jpg' ;
    }
  }
}
