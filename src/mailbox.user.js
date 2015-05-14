// ==UserScript==
// @name           mailBox
// @namespace      http://www.aidansean.com
// @description    Repalces the Thingbox logo with the Daily Mail logo
// @include        http*://*thingbox.com/*
// @include        http*://*myofficebox.com/*
// ==/UserScript==

var imgs = document.getElementsByTagName('img') ;
for(var i=0 ; i<imgs.length ; i++)
{
  if(imgs[i].className=='logo')
  {
    imgs[i].src='http://i.dailymail.co.uk/i/sitelogos/logo_mol.gif' ;
    imgs[i].style.backgroundColor='white' ;
    imgs[i].style.padding='2px' ;
    imgs[i].style.border='1px solid black' ;
    imgs[i].style.width='175px' ;
    imgs[i].style.height='33px' ;
    break ;
  }
}
