// ==UserScript==
// @name           beingAKittensCool
// @namespace      http://www.aidansean.com
// @include        http://www.thingbox.com/
// @include        https://www.thingbox.com/
// @include        http://thingbox.com/
// @include        https://thingbox.com/
// @include        http://www.myofficebox.com/
// @include        https://www.myofficebox.com/
// @include        http://myofficebox.com/
// @include        https://myofficebox.com/
// ==/UserScript==

// MAKE KITTEH
var kitten = document.createElement('img') ;
kitten.src = 'http://1.bp.blogspot.com/_EXopv5BJbnY/Sw3iHTqsjgI/AAAAAAAACuc/wbLR22BdNOY/s1600/cute-kitten-9.jpg' ;
kitten.style.width  = '438px' ;
kitten.style.height = '480px' ;
kitten.style.border = '1px solid black' ;
kitten.alt = 'Being a kitten\'s cool!' ;

// Values of youtube paramter
var urls = new Array() ;
urls[0] = 'http://www.youtube.com/v/lVmmYMwFj1I' ;

var params = document.getElementsByTagName('param') ;
for(var i=0 ; i<params.length ; i++)
{
  for(var j=0 ; j<urls.length ; j++)
  {
    if(params[i].value==urls[j])
    {
      params[i].parentNode.parentNode.appendChild(kitten, params[i]) ;
      params[i].parentNode.parentNode.removeChild(params[i].parentNode) ;
      break ;
    }
  }
}