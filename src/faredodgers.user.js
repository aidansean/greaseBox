// ==UserScript==
// @name           fareDodgers
// @namespace      http://www.aidansean.com
// @description    Flags unreciprocated invites
// @include        http://www.thingbox.com/members/invites
// ==/UserScript==

var content = document.getElementById('content') ;
content.style.lineHeight = '12pt' ;
var children = content.getElementsByTagName('*') ;
var invitees = new Array() ;
var inviters = new Array() ;
var position = 0 ;
for(var i=0 ; i<children.length ; i++)
{
  var child = children[i] ;
  if(child.innerHTML.match('You have been invited to the private galleries of the following members:'))
  {
    position = 1 ;
    continue ;
  }
  if(child.innerHTML.match('The following people have been invited to your private gallery:'))
  {
    position = 2 ;
    continue ;
  }
  if(child.tagName=='A')
  {
    if(child.innerHTML.match('<strike>')) continue ;
    if(position==1) inviters.push(child.href) ;
    if(position==2) invitees.push(child.href) ;
  }
}
var links = content.getElementsByTagName('A') ;

for(var i=1 ; i<links.length-1 ; i++)
{
  var invitee = false ;
  var inviter = false ;
  for(var j=0 ; j<invitees.length ; j++)
  {
    if(invitees[j]==links[i].href)
    {
      invitee = true ;
      break ;
    }
  }
  for(var j=0 ; j<inviters.length ; j++)
  {
    if(inviters[j]==links[i].href)
    {
      inviter = true ;
      break ;
    }
  }
  
  var span = document.createElement('span') ;
  links[i].style.color = 'black' ;
  links[i].style.padding = '2px' ;
  if(invitee==true && inviter==false)
  {
    links[i].style.backgroundColor = '#ffdddd' ;
    span.innerHTML = '&#9746;' ;
  }
  if(invitee==true && inviter==true)
  {
    links[i].style.backgroundColor = '#ddffdd' ;
    span.innerHTML = '&#9745;' ;
  }
  if(invitee==false && inviter==true)
  {
    links[i].style.backgroundColor = '#ffffdd' ;
    span.innerHTML = '&#9744;' ;
  }
  links[i].parentNode.insertBefore(span, links[i]) ;
}