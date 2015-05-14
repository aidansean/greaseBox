// ==UserScript==
// @name           hotTopics
// @namespace      http://www.aidansean.com
// @description    Track hot topics on ThingBox
// @include        http://www.thingbox.com/*
// ==/UserScript==

var names  = new Array() ;
var colors = new Array() ;
var button_colors = new Array() ;

// Change these arrays to change the buttons
// names refers to the names of the cookies where the information is stored.
// titles refers to what you will actually see on Thingbox
// display_colors refers to the colours you will see on Thingbox
// button_colors refers to the colours of the buttons you will see on Thingbox.  
//     Thingbox appears to support green, blue, red, magenta, orange and yellow
names          = [     'hot' ,     'cold' ,     'meh' ] ;
titles         = [     'HOT' ,     'COLD' ,     'MEH' ] ;
display_colors = [ '#ffdddd' ,  '#ddddff' , '#ffffff' ] ;
button_colors  = [     'red' ,     'blue' ,  'yellow' ] ;

var in_thread = false ;
var url_parts = document.URL.split('/') ;
if(url_parts[4]=='thread') in_thread = true ;
var thread = 0 ;
var thread_div = 0 ;
if(in_thread==true) thread = url_parts[5] ;

if(in_thread)
{
  var divs = document.getElementsByTagName('div') ;
  for(var i=0 ; i<divs.length ; i++)
  {
    if(divs[i].className=='thread')
    {
      thread_div = divs[i] ;
      var div = document.createElement('div') ;
      div.id = 'hotTopics' ;
      var span ;
      for(var j=0 ; j<names.length ; j++)
      {
        span = document.createElement('span') ;
        span.id = 'hottopic_' + names[j] ;
        span.className  = "awesome small " + button_colors[j] ;
        span.innerHTML  = titles[j] ;
        span.addEventListener("click", function(e){ set(e) ;},false) ;
        div.appendChild(span) ;
      }
      thread_div.insertBefore(div,document.getElementById('pagelinks')) ;    
      break ;
    }
  }
}
updateLinks() ;

function updateLinks()
{
  var lists = new Array() ;
  for(var i=0 ; i<names.length ; i++)
  {
    lists[i] = getCookie(names[i]).split(',') ;
  }
  var links = document.getElementsByTagName('a') ;
  for(var i=0 ; i<links.length ; i++)
  {
      for(var j=0 ; j<lists.length ; j++)
      {
        for(var k=0 ; k<lists[j].length ; k++)
        {
          if(
            links[i].href.split('/')[4]=='thread'    && 
            links[i].href.split('/')[5]==lists[j][k] &&
            links[i].className!='prev_page'          &&
            links[i].className!='next_page'          &&
            links[i].rel!='prev start'               &&
            links[i].rel!='next'                     &&
            links[i].id!='status_popper'             &&
            links[i].id!='open-deskbox'
            )
          {
            links[i].parentNode.style.backgroundColor = display_colors[j] ;
          }
        }
    }
  }
  if(in_thread==true)
  {
    var h2s = thread_div.getElementsByTagName('h2') ;
    for(var j=0 ; j<lists.length ; j++)
    {
      for(var k=0 ; k<lists[j].length ; k++)
      {
        if(thread==lists[j][k]) h2s[0].style.backgroundColor = display_colors[j] ;
      }
    }
  }
}


function set(e)
{
  var string = e.target.id ;
  for(var i=0 ; i<names.length ; i++)
  {
    if(string=='hottopic_'+names[i])
    {
      addToCookie(names[i]) ;
    }
    else
    {
      removeFromCookie(names[i]) ;
    }
  }
  updateLinks() ;
}

function removeFromCookie(name)
{
  var old_cookie = getCookie(name) ;
  var old_threads = old_cookie.split(',') ;
  var new_threads = new Array() ;
  var counter = 0 ;
  for(var i=0 ; i<old_threads.length ; i++)
  {
    if(old_threads[i]!=thread)
    {
      new_threads[counter] = old_threads[i] ;
      counter++ ;
    }
  }
  var new_cookie = new_threads.join(',') ;
  setCookie(name, new_threads, 365) ;
}

function addToCookie(name)
{
  var old_cookie = getCookie(name) ;
  var threads = old_cookie.split(',') ;
  var add = true ;
  for(var i=0 ; i<threads.length ; i++)
  {
    if(threads[i]==thread)
    {
			add = false ;
			break ;
    }
  }
  if(add==true) threads[threads.length] = thread ;
  var new_cookie = threads.join(',') ;
  setCookie(name, threads, 365) ;
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