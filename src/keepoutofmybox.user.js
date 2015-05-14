// ==UserScript==
// @name           KeepOutOfMyBox
// @namespace      http://www.aidansean.com
// @description    Removes posts and messages from specified users.
// @include        http://www.thingbox.com/*
// ==/UserScript==

// Add user ids to the toBlock array to block multiple people's posts and messages.
var toBlock = [ '19124' ] ;

var allDivs = document.getElementsByTagName("div") ;
for(var i=0 ; i<allDivs.length ; i++)
{
  var div = allDivs[i] ;
  if(div.id.match('bmw'))
  {
    var links = div.getElementsByTagName("a") ;
    for(var j=0 ; j<links.length ; j++)
    {
      for(var k=0 ; k<toBlock.length ; k++)
      {
        if(links[j].title==toBlock[k])
        {
          div.style.display = 'none' ;
        }
      }
    }
  }
}

var allTrs = document.getElementsByTagName("tr") ;
for(var i=0 ; i<allTrs.length ; i++)
{
  var tr = allTrs[i] ;
  if(tr.className=='row_dark' || tr.className=='row_light')
  {
    var links = tr.getElementsByTagName("a") ;
    for(var j=0 ; j<links.length ; j++)
    {
      for(var k=0 ; k<toBlock.length ; k++)
      {
        if(links[j].title==toBlock[k])
        {
          tr.style.display = 'none' ;
        }
      }
    }
  }
}