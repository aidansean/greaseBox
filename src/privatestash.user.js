// ==UserScript==
// @name           PrivateStash
// @namespace      http://www.aidansean.com
// @description    Save private photos to a stash
// @include        http://www.thingbox.com/members/profile/privateStash
// @include        http://www.thingbox.com/photos
// ==/UserScript==

var cookie_urls   = new Array() ;
var cookie_thumbs = new Array() ;
var cookie_titles = new Array() ;

updateArrays()
var comma = '&#44;' ;
var url = document.URL ;

if(url=='http://www.thingbox.com/' + obfuscate('yMqfH/DRGevjHHnrGej/NlZAFRKf'))    showStash() ;
if(url=='http://www.myofficebox.com/' + obfuscate('yMqfH/DRGevjHHnrGej/NlZAFRKf')) showStash() ;
if(url=='http://www.thingbox.com/photos')                          addStashLink() ;
if(url=='http://www.myofficbox.com/photos')                        addStashLink() ;
if(url.match('http://www.thingbox.com/photos/show/private'))       addStashButton() ;
if(url.match('http://www.myofficbox.com/photos/show/private'))     addStashButton() ;

function addToStash()
{
  // Get thumb
  var links = document.getElementsByTagName('a') ;
  for(var i=0 ; i<links.length ; i++)
  {
    if(links[i].href==url)
    {
      var imgs = links[i].getElementsByTagName('img') ;
      if(imgs.length>0)
      {
        thumb = imgs[0].src ;
        break ;
      }
    }
  }
  
  // Get title
  var h2s = document.getElementById('content').getElementsByTagName('h2') ;
  title = h2s[0].innerHTML.split('<span')[0] ;
  title = title.replace(',',comma) ;
  
  addToCookie('ps_urls'  , url  ) ;
  addToCookie('ps_titles', title) ;
  addToCookie('ps_thumbs', thumb) ;
  
  addStashButton() ;
}

function removeFromStash()
{
  // Get thumb
  var links = document.getElementsByTagName('a') ;
  for(var i=0 ; i<links.length ; i++)
  {
    if(links[i].href==url)
    {
      var imgs = links[i].getElementsByTagName('img') ;
      if(imgs.length>0)
      {
        thumb = imgs[0].src ;
        break ;
      }
    }
  }
  
  // Get title
  var h2s = document.getElementById('content').getElementsByTagName('h2') ;
  title = h2s[0].innerHTML.split('<span')[0] ;
  title = title.replace(',',comma) ;
  
  removeFromCookie('ps_urls'  , url  ) ;
  removeFromCookie('ps_titles', title) ;
  removeFromCookie('ps_thumbs', thumb) ;
  
  addStashButton() ;
}

function addStashLink()
{
  var links = document.getElementsByTagName('a') ;
  for(var i=0 ; i<links.length ; i++)
  {
    if(obfuscate(links[i].innerHTML)=='mUcZHccMb')
    {
      var link = document.createElement('a') ;
      link.className = 'awesome small' ;
      if(url.match('thingbox.com'))
      {
        link.href = 'http://www.thingbox.com/' + obfuscate('yMqfH/DRGevjHHnrGej/NlZAFRKf') ;
      }
      else
      {
        link.href = 'http://www.myofficebox.com/' + obfuscate('yMqfH/DRGevjHHnrGej/NlZAFRKf') ;
      }
      link.innerHTML = 'your private stash' ;
      links[i].parentNode.appendChild(link) ;
      break ;
    }
  }
}

function showStash()
{
  var ps = document.getElementsByTagName('p') ;
  for(var i=0 ; i<ps.length ; i++)
  {
    if(ps[i].innerHTML=='Whoa! Sorry!') ps[i].style.display = 'none' ;
    if(ps[i].innerHTML=='We can\'t find that profile. You can search for profiles <a href="/members/list">over here</a>.')
    {
      ps[i].style.display = 'none' ;
      // Change heading
      var h2s = ps[i].parentNode.getElementsByTagName('h2') ;
      h2s[0].innerHTML = '<span class="subtle">private stash photo gallery</span>' ;
      
      // Add gallery div
      var bigDiv = document.createElement('div') ;
      bigDiv.id = 'gallery_index' ;
      
      // Add thumbs
      for(var j=1 ; j<cookie_urls.length ; j++)
      {
        var smallDiv = document.createElement('div') ;
        smallDiv.className = 'thumb' ;
        var link = document.createElement('a') ;
        link.href = cookie_urls[j] ;
        var img = document.createElement('img') ;
        img.src  = cookie_thumbs[j] ;
        link.appendChild(img) ;
        var h3 = document.createElement('h3') ;
        h3.innerHTML = cookie_titles[j] ;
        smallDiv.appendChild(link) ;
        smallDiv.appendChild(h3) ;
        bigDiv.appendChild(smallDiv) ;
      }
      ps[i].parentNode.appendChild(bigDiv) ;
      
      break ;
    }
  }
}

function addStashButton()
{
  var button = document.getElementById('ps_button') ;
  if(button)
  {
    button.parentNode.removeChild(button) ;
  }
  var links = document.getElementsByTagName('a') ;
  for(var i=0 ; i<links.length ; i++)
  {
    if(links[i].innerHTML == 'return to private gallery' && links[i].className=='awesome small')
    {
      var inStash = false ;
      for(var j=0 ; j<cookie_urls.length ; j++)
      {
        if(url==cookie_urls[j]) inStash = true ;
      }
      if(inStash==true)
      {
        var link = document.createElement('a') ;
        link.className = 'awesome small green' ;
        link.innerHTML = 'remove from your private stash' ;
        link.id = 'ps_button' ;
        link.addEventListener("click", function(){ removeFromStash() ;},false) ;
        links[i].parentNode.appendChild(link) ;
      }
      else
      {
        var link = document.createElement('a') ;
        link.className = 'awesome small green' ;
        link.innerHTML = 'add to your private stash' ;
        link.id = 'ps_button' ;
        link.addEventListener("click", function(){ addToStash() ;},false) ;
        links[i].parentNode.appendChild(link) ;
      }
      break ;  
    }
  }
}

function updateArrays()
{
  cookie_urls   = getCookie('ps_urls').split(',') ;
  cookie_thumbs = getCookie('ps_thumbs').split(',') ;
  cookie_titles = getCookie('ps_titles').split(',') ;
}

function removeFromCookie(name, value)
{
  var old_cookie = getCookie(name) ;
  var old_values = old_cookie.split(',') ;
  var new_values = new Array() ;
  var counter = 0 ;
  for(var i=0 ; i<old_values.length ; i++)
  {
    if(old_values[i]!=value)
    {
      new_values[counter] = old_values[i] ;
      counter++ ;
    }
  }
  var new_cookie = new_values.join(',') ;
  setCookie(name, new_values, 365) ;
  updateArrays() ;
}

function addToCookie(name, value)
{
  var old_cookie = getCookie(name) ;
  var values = old_cookie.split(',') ;
  var add = true ;
  for(var i=0 ; i<values.length ; i++)
  {
    if(values[i]==value)
    {
			add = false ;
			break ;
    }
  }
  if(add==true) values[values.length] = value ;
  var new_cookie = values.join(',') ;
  setCookie(name, values, 365) ;
  updateArrays() ;
}

function getCookie(c_name)
{
  if(document.cookie.length>0)
  {
    c_start=document.cookie.indexOf(c_name + "=") ;
    if(c_start!=-1)
    {
      c_start=c_start + c_name.length+1 ;
      c_end=document.cookie.indexOf(";",c_start) ;
      if (c_end==-1) c_end=document.cookie.length ;
      return unescape(document.cookie.substring(c_start,c_end)) ;
    }
  }
  return "" ;
}

function setCookie(c_name,value,expiredays)
{
  var exdate = new Date() ;
  exdate.setDate(exdate.getDate()+expiredays) ;
  var cookie = c_name+ "=" + escape(value) + ";expires=" + exdate.toUTCString() + ";path=/" ;
  document.cookie = cookie ;
}

function obfuscate(string)
{
  var chars = new Array() ;
  chars[0]  = 'a' ;
  chars[1]  = 'b' ;
  chars[2]  = 'c' ;
  chars[3]  = 'd' ;
  chars[4]  = 'e' ;
  chars[5]  = 'f' ;
  chars[6]  = 'g' ;
  chars[7]  = 'h' ;
  chars[8]  = 'i' ;
  chars[9]  = 'j' ;
  chars[10] = 'k' ;
  chars[11] = 'l' ;
  chars[12] = 'm' ;
  chars[13] = 'n' ;
  chars[14] = 'o' ;
  chars[15] = 'p' ;
  chars[16] = 'q' ;
  chars[17] = 'r' ;
  chars[18] = 's' ;
  chars[19] = 't' ;
  chars[20] = 'u' ;
  chars[21] = 'v' ;
  chars[22] = 'w' ;
  chars[23] = 'x' ;
  chars[24] = 'y' ;
  chars[25] = 'z' ;
  chars[26] = 'A' ;
  chars[27] = 'B' ;
  chars[28] = 'C' ;
  chars[29] = 'D' ;
  chars[30] = 'E' ;
  chars[31] = 'F' ;
  chars[32] = 'G' ;
  chars[33] = 'H' ;
  chars[34] = 'I' ;
  chars[35] = 'J' ;
  chars[36] = 'K' ;
  chars[37] = 'L' ;
  chars[38] = 'M' ;
  chars[39] = 'N' ;
  chars[40] = 'O' ;
  chars[41] = 'P' ;
  chars[42] = 'Q' ;
  chars[43] = 'R' ;
  chars[44] = 'S' ;
  chars[45] = 'T' ;
  chars[46] = 'U' ;
  chars[47] = 'V' ;
  chars[48] = 'W' ;
  chars[49] = 'X' ;
  chars[50] = 'Y' ;
  chars[51] = 'Z' ;
  chars[52] = ':' ;
  chars[53] = '/' ;
  var seed = 311 ;
  var value = 0 ;
  var string_out = '' ;
  var letters = string.split('') ;
  var temp = 0 ;
  for(var i=0 ; i<letters.length ; i++)
  {
    for(var j=0 ; j<chars.length ; j++)
    {
      if(chars[j]==letters[i])
      {
        temp = (temp+j*seed)%chars.length ;
        string_out = string_out + chars[temp] ;
        break ;
      }
    }
    
  }
  return string_out ;
}