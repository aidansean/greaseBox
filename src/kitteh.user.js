// ==UserScript==
// @name           kitteh
// @namespace      http://www.aidansean.com
// @description    See kittens!
// @include        http://*thingbox.com/account/welcome/kittens
// @include        http://*myofficebox.com/account/welcome/kittens
// ==/UserScript==

if(document.URL.match('account/welcome'))
{
  var h2 = document.createElement('h2') ;
  h2.innerHTML = '<a href="/account/welcome/kittens">kitteh!</a>' ;
  document.getElementById('content').insertBefore(h2, document.getElementById('image_promo_list')) ;
}

var youtube_ids = new Array() ;
youtube_ids[0]  = '0Bmhjf0rKe8' ;
youtube_ids[1]  = '7M-jsjLB20Y' ;
youtube_ids[2]  = '-1ELq92bakk' ;
youtube_ids[3]  = '0vmoZEaN_-o' ;
youtube_ids[4]  = 'bZg1kUiKIfI' ;
youtube_ids[5]  = '-ER3nou4tuc' ;
youtube_ids[6]  = 'hMDhyDFqtz8' ;
youtube_ids[7]  = 'oNS6SUe-kGc' ;
youtube_ids[8]  = 'Q_udqEp_YR4' ;
youtube_ids[9]  = '_ZSbC09qgLI' ;
youtube_ids[10] = '-efQuSlxgWY' ;
youtube_ids[11] = 'owXxuKsZdyE' ;

var div = document.createElement('div') ;
div.style.width     =           '425px' ;
div.style.height    =           '350px' ;
div.style.margin    =            'auto' ;
div.style.textAlign =          'center' ;
div.style.border    = '1px solid black' ;

var index = -1 ;

if(document.URL.match('account/welcome/kittens'))
{
	index = Math.floor(Math.random()*(youtube_ids.length)) ;
}
if(document.URL.match('account/welcome/kitten='))
{
  var url = document.URL ;
  var parts = url.split('=') ;
  index = parseInt(parts[1]) ;
}

if(index>-1 && index<youtube_ids.length)
{
  var id = youtube_ids[index] ;
	div.innerHTML = '<object width="425" height="350"><param name="movie" value="http://www.youtube.com/v/' + id + '"></param><param name="wmode" value="transparent"></param><embed src="http://www.youtube.com/v/' + id + '" type="application/x-shockwave-flash" wmode="transparent" width="425" height="350"></embed></object>' ;
	
	document.getElementById('content').insertBefore(div, document.getElementById('image_promo_list')) ;
}