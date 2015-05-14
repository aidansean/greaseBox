// ==UserScript==
// @name           chokingHazard
// @namespace      http://www.aidansean.com
// @description    Adds a public health warning to the top of threads that contain posts by certain users
// @include        http://www.thingbox.com/*
// ==/UserScript==

var troll_numbers = new Array() ;
var troll_names   = new Array() ;
var troll_present = new Array() ;
troll_numbers = [ '20957' , '3024' ,    '13430' ] ;
troll_names   = [   'DoG' ,  'Mal' , 'bryanboy' ] ;
for(var i=0 ; i<troll_numbers.length ; i++){ troll_present[i] = false ; }

var links = document.getElementById('postings').getElementsByTagName('a') ;
for(var i=0 ; i<links.length ; i++)
{
  if(links[i].className=='profile')
  {
    for(var j=0 ; j<troll_numbers.length ; j++)
    {
      if(links[i].href.split('/')[5]==troll_numbers[j])
      {
        troll_present[j] = true ;
        break ;
      }
    }
  }
}
var number_of_trolls = 0 ;
for(var i=0 ; i<troll_numbers.length ; i++){ if(troll_present[i]==true) number_of_trolls++ ; }
if(number_of_trolls>0)
{
  var warning = 'Warning!  This thread contains traces of:' ;
  for(var i=0 ; i<troll_numbers.length ; i++)
  {
     if(troll_present[i]==true) warning =  warning + ' ' + troll_names[i] ;
  }
  warning =  warning + '.  User discretion advised.' ;
  var warning_div = document.createElement('div') ;
  warning_div.style.backgroundColor = '#ffeeee' ;
  warning_div.style.border = '1px solid #ffaaaa' ;
  warning_div.style.margin = '5px' ;
  warning_div.style.padding = '5px' ;
  warning_div.style.textAlign = 'center' ;
  warning_div.innerHTML = warning ;
  document.getElementById('postings').insertBefore(warning_div, document.getElementById('postings').firstChild) ;
}

