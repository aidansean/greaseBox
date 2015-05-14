// ==UserScript==
// @name           usersList
// @namespace      http://www.aidansean.com
// @description    Makes a clean list of users
// @include        http://www.thingbox.com/users/*, http://www.myofficebox.com/users/*
// ==/UserScript==

// Each member of users is an array containing:
//   Member number
//   Member url
//   Member name

var users = new Array() ;
var type = 0 

// http://www.thingbox.com/friends/list/4913
// http://www.thingbox.com/groups/members/130
// http://www.thingbox.com/events/members/4799
// http://www.thingbox.com/events/members/4799?page=2type=friends
// http://www.thingbox.com/events/members/4799?page=2&type=probables

var url = document.URL ;
if(url.match('http://www.thingbox.com/friends/list/'))   type = 1 ;
if(url.match('http://www.thingbox.com/groups/members/')) type = 2 ;
if(url.match('http://www.thingbox.com/events/members/')) type = 3 ;

var split_string = '' ;
if(type==1) split_string = "<div id='friend_list'>" ;
if(type==2) split_string = '<div class="members">' ;
if(type==3) split_string = '<div class="members">' ;

var url_parts = url.split('/') ;
var user_id = url_parts[5] ;
var collection_parts = url_parts[5].split('?') ;
var collection = collection_parts[0] ;
var id = -1 ;
if(type==1) id = user_id ;
if(type==2 || type==3) id = collection ;
var links = document.getElementsByTagName('a') ;
var nPages = 1 ;
for(var i=0 ; i<links.length ; i++)
{
  if(links[i].href.match('page='))
  {
    var href_parts = links[i].href.split('=') ;
    if(parseInt(href_parts[1])>nPages) nPages = parseInt(href_parts[1]) ;
  }
}

// Retrieve users using AJAX
var page_urls = new Array() ;
var users_links = new Array() ;
var AJAX_counter = 0 ;
var counter = 0 ;
for(var i=0 ; i<nPages ; i++)
{
  if(type==1) page_urls[i] = 'http://www.thingbox.com/friends/list/'   + id + '?page=' + (i+1) ;
  if(type==2) page_urls[i] = 'http://www.thingbox.com/groups/members/' + id + '?page=' + (i+1) ;
  if(type==3) page_urls[i] = 'http://www.thingbox.com/events/members/ '+ id + '?page=' + (i+1) ;
  GM_xmlhttpRequest
  (
    { 
      method: "GET",
      url: page_urls[i],
      onload: function(response)
      {
        AJAX_counter++ ;
        var source_parts = response.responseText.split(split_string) ;
        var source = source_parts[1] ;
        source_parts = source.split('<h2>') ;
        var source = source_parts[0] ;
        var lines = source.split('\n') ;
        for(var j=0 ; j<lines.length ; j++)
        {
          if(lines[j].match(/\s*<a href="\/members\/profile\/[0-9]+"\starget="thingbox"\sclass="profile"\stitle="[0-9]+">/))
          {
            users_links[counter] = lines[j] ;
            if(j<5) alert(counter + ' ' + user_links[counter]) ;
            counter++ ;
          }
        }
        if(AJAX_counter==nPages) addFriends() ;
      }
    }
  ) ;
}

function addFriends()
{
  counter = 0 ;
  for(var j=0 ; j<users_links.length ; j++)
	{
		var parts = users_links[j].split('title="') ;
		var part  = parts[1] ;
		parts = part.split('"') ;
		var user_id = parts[0] ;
		
		var parts = users_links[j].split('href="') ;
		var part  = parts[1] ;
		parts = part.split('"') ;
		var user_url = parts[0] ;
		
		var parts = users_links[j].split('>') ;
		var part  = parts[1] ;
		parts = part.split('<') ;
		var user_name = parts[0] ;
		
		var add_user = true ;
		for(var k=0 ; k<users.length ; k++)
		{
			if(user_id==users[k][0]) add_user = false ;			  
		}
		if(add_user==true)
		{
			users[counter] = new Array() ;
			users[counter][0] = user_id   ;
			users[counter][1] = user_url  ;
			users[counter][2] = user_name ;
			counter++ ;
		}
	}
  users.sort(sortByName) ;
  var div = document.createElement('div') ;
  var  h3 = document.createElement('h3') ;
  var  ul = document.createElement('ul') ;
  h3.innerHTML = 'All users listed by username:' ;
  for(var k=0 ; k<users.length ; k++)
  {
    var li = document.createElement('li') ;
    li.innerHTML = '<a href="' + users[k][1] + '">' + users[k][2] + '</a>' ;
    ul.appendChild(li) ;
  }
  div.appendChild(h3) ;
  div.appendChild(ul) ;
  document.getElementById('content').insertBefore(div, document.getElementById('content').firstChild) ;
}

function sortByName(a, b)
{
    var x = a[2].toLowerCase();
    var y = b[2].toLowerCase();
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}


