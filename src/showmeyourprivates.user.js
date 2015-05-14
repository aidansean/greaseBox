// ==UserScript==
// @name           showMeYourPrivates
// @namespace      http://www.aidansean.com
// @description    Reveals private galleries on thingbox
// @include        http*://*.thingbox.com/*
// @include        http*://thingbox.com/*
// @include        http*://*.myofficebox.com/*
// @include        http*://myofficebox.com/*
// ==/UserScript==

var url = document.URL ;

// Regex to match the correct domain
var regex_thingbox  = '/(http:\/\/)?(www.)?thingbox.com\/*/' ;
var regex_officebox = '/(http:\/\/)?(www.)?myofficebox.com\/*/' ;
var regex_bothbox   = '/(http:\/\/)?(www.)?(thingbox|myofficebox).com\/*/' ;
var domain = '' ;
if(url.match(regex_thingbox))  domain = 'http://www.thingbox.com' ;
if(url.match(regex_officebox)) domain = 'http://www.myofficebox.com' ;

// Detect private gallery
if(url.match(/^(.*)account\/restricted$/)) window.location = domain + '/account/welcome/privates' ;

// Redirect to new page
if(url.match(/^(.*)account\/welcome\/privates$/)){
  //alert('Working.  Please wait a few seconds...') ;
  var text = '<h2>Show me your privates</h2>' ;
  text = text + '<iframe title="YouTube video player" width="640" height="510" src="http://www.youtube.com/embed/oHg5SJYRHA0?autoplay=1" frameborder="0" allowfullscreen></iframe>' ;
  var d = new Date() ;
  if(d.getDate()==1 && d.getMonth()==3) alert('Happy April Fool\'s day ' + d.getFullYear() + '!') ;
  document.getElementById('content').innerHTML = text ;
}

// Fix links
if(url.match(/^(.*)\/members\/profile\/$/)){
  var spans = document.getElementsByTagName('span') ;
  for(var i=0 ; i<spans.length ; i++){
  if(spans[i].innerHTML=='23' && spans[i].className=='big'){
    spans[i].innerHTML = Math.floor(1+12*Math.random()) ;
    break ;
  }
  }
}
