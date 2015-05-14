// ==UserScript==
// @name           guessWho
// @namespace      http://www.aidansean.com
// @include        http*://*thingbox.com/*
// @include        http*://*myofficebox.com/*
// ==/UserScript==

var divs = document.getElementsByTagName('div') ;
for(var i=0 ; i<divs.length ; i++){ if(divs[i].className=='thumb') divs[i].style.display = 'none' ; }
var spans = document.getElementsByTagName('span') ;
for(var i=0 ; i<spans.length ; i++){ if(spans[i].className=='headshot_wrap') spans[i].style.display = 'none' ; }
var imgs = document.getElementsByTagName('img') ;
for(var i=0 ; i<imgs.length ; i++){ if(imgs[i].className=='headshot') imgs[i].style.display = 'none' ; }
