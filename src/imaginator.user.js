// ==UserScript==
// @name           imaginator
// @namespace      http://www.aidansean.com
// @description    Turn links to images into images
// @include        http://www.thingbox.com/*
// ==/UserScript==

var links = document.getElementsByTagName('a') ;
var extensions = [ 'jpg' , 'jpeg' , 'gif' , 'png' ] ;
var imagesOnPage = new Array() ;
for(var i=0 ; i<links.length ; i++)
  {
    var showImage = false ;
    for(var j=0 ; j<extensions.length ; j++)
    {
      var pattern = '\.' + extensions[j] + '$' ;
      if(links[i].href.match(pattern) )
      {
        showImage = true ;
        for(var k=0 ; k<imagesOnPage.length ; k++)
        {
          if(links[i].href==imagesOnPage[k]) showImage = false ;
        }
      }
    }
    if(links[i].href=='http://img.chan4chan.com/img/2009-11-28/i00wn4mmk6r96rp64j0y.jpg') showImage = false ;
    if(showImage)
    {
      var p = document.createElement('p') ;
      p.style.textAlign = 'center' ;
      p.innerHTML = '<img src="' + links[i].href + '" style="border:1px solid black;margin:auto"/>' ;
      links[i].parentNode.parentNode.appendChild(p) ;
      imagesOnPage[imagesOnPage.length] = links[i].href ;
    }
  }