// ==UserScript==
// @name           paintBox
// @namespace      http://www.aidansean.com
// @description    Changes backgorund colour when there is a new message/tracked topic
// @include        http://www.thingbox.com/members/deskbox
// ==/UserScript==

var hasTracked = false ;
var hasMessage = false ;
var uls = document.getElementsByTagName('ul') ;
for(var i=0 ; i<uls.length ; i++)
{
  if(uls[i].id=='tracked') hasTracked = true ;
  if(uls[i].id=='inbox')   hasMessage = true ;
}

var divs = document.getElementsByTagName('div') ;
divs[0].style.backgroundColor = '' ;

var bodies = document.getElementsByTagName('body') ;
var body = bodies[0] ;

var div = document.getElementById('deskbox') ;
if(hasTracked==true  && hasMessage==true)  { div.style.backgroundColor = '#ccffcc' ; body.style.background = '#ccffcc' ; }
if(hasTracked==true  && hasMessage==false) { div.style.backgroundColor = '#ffffcc' ; body.style.background = '#ffffcc' ; }
if(hasTracked==false && hasMessage==true)  { div.style.backgroundColor = '#ccccff' ; body.style.background = '#ccccff' ; }