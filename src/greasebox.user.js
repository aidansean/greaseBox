// ==UserScript==
// @name           greaseBox
// @namespace      http://www.aidansean.com
// @include        http*://*.thingbox.com/*
// @include        http*://thingbox.com/*
// @include        http*://*.myofficebox.com/*
// @include        http*://myofficebox.com/*
// @description    Compilation of Greasmonkey scripts for ThingBox
// ==/UserScript==

//==================================================================================================
// Start framework
//==================================================================================================
// Get useful variables etc
var head  = getTags('head')[0] ;
var body  = getTags('body')[0] ;
var links = getTags('a')    ;
var divs  = getTags('div')  ;
var imgs  = getTags('img')  ;
var spans = getTags('span') ;

var url = document.URL ;

// Regex to match the correct domain
var regex_thingbox  = '/(http:\/\/)?(www.)?thingbox.com\/*/' ;
var regex_officebox = '/(http:\/\/)?(www.)?myofficebox.com\/*/' ;
var regex_bothbox   = '/(http:\/\/)?(www.)?(thingbox|myofficebox).com\/*/' ;
var domain = '' ;
if(url.match(regex_thingbox))  domain = 'http://www.thingbox.com' ;
if(url.match(regex_officebox)) domain = 'http://www.myofficebox.com' ;

var deskbox = false ;
var deskboxRegex = domain+'/members/deskbox' ;
if(url.match(deskboxRegex)) deskbox = true ;

//==================================================================================================
// Create log
//==================================================================================================
var debug = 0 ;
if(url.match(/\?debug/)) debug = 1 ;
var debugPanel = getId('div_debug') ;
if(debugPanel==null) makeDebugPanel() ;

if(deskbox){
  logTitle('Deskbox: true') ;
}
else{
  logTitle('Deskbox: false') ;
}

function makeDebugPanel(){
  //if(deskbox==true) return ;
  debugPanel = create('div') ;
  debugPanel.id = 'div_debug' ;
  if(debug==0) debugPanel.style.display = 'none' ;
  debugPanel.style.border = '1px solid black' ;
  debugPanel.style.backgroundColor = '#eeeeee' ;
  debugPanel.style.width = '80%' ;
  debugPanel.style.margin = 'auto' ;
  debugPanel.style.clear = 'both' ;
  var debugH2 = create('h2') ;
  debugH2.innerHTML = 'debug panel' ;
  debugH2.style.textAlign = 'center' ;
  debugH2.style.backgroundColor = '#ffffff' ;
  debugH2.style.margin = '0px' ;
  debugPanel.appendChild(debugH2) ;
  var debugDl = create('dl') ;
  debugDl.id = 'debug_dl' ;
  debugDl.padding = '20px' ;
  debugPanel.appendChild(debugDl) ;
  if(deskbox){
    body.appendChild(debugPanel) ;
  }
  else{
    getId('content').appendChild(debugPanel) ;
  }
  addStyle('dd.debug, dt.debug{font-size:12pt ; font-family:arial ; padding:5px} dd.debug{padding-left:25px} dt.debug{margin-top:20px}') ;
}
function logTitle(text){
  if(getId('div_debug')==null) return ;
  var dt = create('dt') ;
  dt.className = 'debug' ;
  dt.innerHTML = text ;
  getId('debug_dl').appendChild(dt) ;
}
function log(text){
  if(getId('div_debug')==null) return ;
  var dd = create('dd') ;
  dd.className = 'debug' ;
  dd.innerHTML = text ;
  getId('debug_dl').appendChild(dd) ;
}

// Get user id
var user_id   = initialise('user_id', '0') ;
var user_name = initialise('user_name', '') ;
if(user_id=='0') getUserId() ;
function getUserId(){
  var profileUrl = domain + '/members/profile' ;
  log('Getting user_id') ;
  GM_xmlhttpRequest
	(
		{ 
			method: "GET",
			url: profileUrl,
			onload: function(response){
				result = response.responseText ;
				var div = create('div') ;
				div.innerHTML = result.replace(/<script(.|\s)*?\/script>/g, '') ;
				var theLinks = div.getElementsByTagName('a') ;
				for(var i=0 ; i<theLinks.length ; i++){
				  if(theLinks[i].href.match('members/activity_log')){
				    user_id = theLinks[i].href.split('/')[5] ;
				    store('user_id', user_id) ;
				    log('Obtained user_id') ;
				    break ;
				  }
				}
				var theDivs = div.getElementsByTagName('div') ;
				for(var i=0 ; i<theDivs.length ; i++){
				  if(theDivs[i].id=='profile'){
				    user_name = theDivs[i].getElementsByTagName('h2')[0].innerHTML.split('<span')[0] ;
				    store('user_name', user_name) ;
				    log('Obtained user_name') ;
				    break ;
				  }
				}
			}
		}
	) ;
}

logTitle('Domain: '    + domain   ) ;
logTitle('URL: '       + url      ) ;
logTitle('user_id: '   + user_id  ) ;
logTitle('user_name: ' + user_name) ;

// Set ids for toolboxes
for(var i=0 ; i<divs.length ; i++){
  if(divs[i].className!='toolbox') continue ;
  if(divs[i].getElementsByTagName('h2').length==1){
		if(divs[i].getElementsByTagName('h2')[0].innerHTML.match('new messages'      )) divs[i].id = 'toolbox_messages'         ;
		if(divs[i].getElementsByTagName('h2')[0].innerHTML.match('friends online'    )) divs[i].id = 'toolbox_friends'          ;
		if(divs[i].getElementsByTagName('h2')[0].innerHTML.match('recent posts'      )) divs[i].id = 'toolbox_recentPosts'      ;
		if(divs[i].getElementsByTagName('h2')[0].innerHTML.match('recent group posts')) divs[i].id = 'toolbox_recentGroupPosts' ;
		if(divs[i].getElementsByTagName('h2')[0].innerHTML.match('upcoming events'   )) divs[i].id = 'toolbox_events'           ;
		if(divs[i].getElementsByTagName('h2')[0].innerHTML.match('recent visitors'   )) divs[i].id = 'toolbox_visitors'         ;
		if(divs[i].getElementsByTagName('h2')[0].innerHTML.match('invites'           )) divs[i].id = 'toolbox_invites'          ;
		if(divs[i].getElementsByTagName('h2')[0].innerHTML.match('new tracked topics')) divs[i].id = 'toolbox_tracked'          ;
  }
}

//==================================================================================================
// Get browser information
//==================================================================================================
var browser = '' ;
if(navigator.userAgent.match('Firefox')) browser = 'firefox' ;
if(navigator.userAgent.match('Chrome') ) browser = 'chrome' ;
logTitle('Browser: ' + browser)
// Browser specific store/retrieve functions
function store(key,value){
  switch(browser){
    case 'chrome' : localStorage[key] = value ; break ;
    case 'firefox': default: GM_setValue(key,value) ; break ;
  }
}
function retrieve(key,defaultValue){
  var value = -1 ;
  switch(browser){
    case 'chrome' : value = (localStorage[key]) ? localStorage[key] : defaultValue ; break ;
    case 'firefox': default: value = GM_getValue(key,defaultValue) ; break ;
  }
  if(value=='false') return false ;
  return value ;
}

//==================================================================================================
// Set flags
//==================================================================================================
var do_blockBox               = retrieve('do_blockBox'              , 'false') ;
var do_showSettings           = retrieve('do_showSettings'          , 'true' ) ;
var do_showHelp               = retrieve('do_showHelp'              , 'true' ) ;
var do_ignoreBox              = retrieve('do_ignoreBox'             , 'true' ) ;
var do_fixIgnores             = retrieve('do_fixIgnores'            , 'true' ) ;
var do_fixLinks               = retrieve('do_fixLinks'              , 'true' ) ;
var do_borderer               = retrieve('do_borderer'              , 'true' ) ;
var do_beingAKittehsCool      = retrieve('do_beingAKittehsCool'     , 'true' ) ;
var do_imaginator             = retrieve('do_imaginator'            , 'true' ) ;
var do_externalisedHomophobia = retrieve('do_externalisedHomophobia', 'true' ) ;
var do_getOutOfMyBox          = retrieve('do_getOutOfMyBox'         , 'false') ;
var do_cockBlock              = retrieve('do_cockBlock'             , 'false') ;
var do_chokingHazard          = retrieve('do_chokingHazard'         , 'false') ;
var do_fareDodgers            = retrieve('do_fareDodgers'           , 'true' ) ;
var do_whatsHisFace           = retrieve('do_whatsHisFace'          , 'true' ) ;
var do_paintBox               = retrieve('do_paintBox'              , 'true' ) ;
var do_kitteh                 = retrieve('do_kitteh'                , 'false') ;
var do_envy                   = retrieve('do_envy'                  , 'false') ;
var do_hotTopics              = retrieve('do_hotTopics'             , 'false') ;
var do_first                  = retrieve('do_first'                 , 'true' ) ;
var do_threadBlock            = retrieve('do_threadBlock'           , 'true' ) ;
var do_videoBlock             = retrieve('do_videoBlock'            , 'false') ;
var do_fastForward            = retrieve('do_fastForward'           , 'true' ) ;
var do_easyIgnore             = retrieve('do_easyIgnore'            , 'true' ) ;
var do_ripeToReply            = retrieve('do_ripeToReply'           , 'false') ;
var do_friendsList            = retrieve('do_friendsList'           , 'true' ) ;
var do_invitePurger           = retrieve('do_invitePurger'          , 'true' ) ;
var do_mailBox                = retrieve('do_mailBox'               , 'false') ;
var do_guessWho               = retrieve('do_guessWho'              , 'false') ;
var do_ninja                  = retrieve('do_ninja'                 , 'true' ) ;

//==================================================================================================
// Settings for various modules
//==================================================================================================

// Delay for wait.gif (to make it look like something is happening at a speed we can comprehend!)
var delay = 200 ;

function initialise(name, defaultValue){
  var value = retrieve(name, defaultValue) ;
  store(name, value) ;
  return value ;
}
function initialiseArray(name, defaultValue, separator){
  var value = retrieve(name, defaultValue).split(separator) ;
  store(name, value.join(separator)) ;
  return value ;
}

// imaginator:
//   1: Safe for work version.  If "NSFW" or "nsfw" appear on the page, no images are shown
//   2: All images are shown
var imaginator_mode = initialise('imaginator_mode', '1') ;

// externalisedHomophobia_mode:
//   1: Add a new link after the existing one (gives you the option of opening the link in the same window)
//   2: Replace existing link with a new one (forces you to open the link in a new window, but saves space)
var externalisedHomophobia_mode = initialise('externalisedHomophobia_mode', '2') ;

// getOutOfMyBox:
//   A comma separated list of member ids and names.
var getOutOfMyBox_numbers = initialiseArray('getOutOfMyBox_numbers', '3024'      ,',') ;
var getOutOfMyBox_names   = initialiseArray('getOutOfMyBox_names'  , 'Malaclypse',',') ;

// cockBlock
//   A comma separated list of member ids and names.
var cockBlock_numbers = initialiseArray('cockBlock_numbers','4913' ,',') ;
var cockBlock_names   = initialiseArray('cockBlock_names'  ,'aidan',',') ;

// chokingHazard:
//   Two comma separated lists of member ids and names.
var chokingHazard_numbers = initialiseArray('chokingHazard_numbers', '20957,3024,13430'          ,',') ;
var chokingHazard_names   = initialiseArray('chokingHazard_names'  , 'DoG,Malaclypse,bryanboy123',',') ;

// paintBox:
//   A list of colors for when you have a new tracked topic and new message, a new tracked topic, and a new message
var paintBox_colors = initialiseArray('paintBox_colors','#aaffaa,#ffffaa,#aaaaff',',') ;
//   Paintbox mode, 1 to show everything, 2 to hide friends from deskbox
var paintBox_mode = initialise('paintbox_mode', '1') ;

// fareDodgers:
//   Two comma separated lists of member ids and names.
var fareDodgers_numbers = initialiseArray('fareDodgers_numbers', '',',') ;
var fareDodgers_names   = initialiseArray('fareDodgers_names'  , '',',') ;

// whatsHisFace
//   G: Show a link to the gallery
//   L: Show a link to the activity log
//   A: Show a link to the adult gallery
//   M: Show a link to message the user
var whatsHisFace_mode = initialise('whatsHisFace_mode', 'GLAM') ;

// envy
//   Envy (originally penisEnvy) replaces avatars with other images.
var envy_mode = initialise('envy_mode', '1') ;

// hotTopics  
//   (Thingbox appears to support green, blue, red, magenta, orange and yellow)
var hotTopics_displayColors = new Array() ;
var hotTopics_buttonColors  = new Array() ;
hotTopics_displayColors[0] = '#ffffff' ; hotTopics_buttonColors[0] = 'white'   ;
hotTopics_displayColors[1] = '#ffdddd' ; hotTopics_buttonColors[1] = 'red'     ;
hotTopics_displayColors[2] = '#ddffdd' ; hotTopics_buttonColors[2] = 'green'   ;
hotTopics_displayColors[3] = '#ddddff' ; hotTopics_buttonColors[3] = 'blue'    ;
hotTopics_displayColors[4] = '#ffddff' ; hotTopics_buttonColors[4] = 'magenta' ;
hotTopics_displayColors[5] = '#ffe4c4' ; hotTopics_buttonColors[5] = 'orange'  ;
hotTopics_displayColors[6] = '#ffffdd' ; hotTopics_buttonColors[6] = 'yellow'  ;

var hotTopics_lists  = initialiseArray('hotTopics_lists' , ';'       ,';') ;
var hotTopics_titles = initialiseArray('hotTopics_titles', 'hot,cold',',') ;
var hotTopics_colors = initialiseArray('hotTopics_colors', '1,3'     ,',') ;

// threadBlock:
//   Two comma separated lists of member ids and names.
var threadBlock_numbers = initialiseArray('threadBlock_numbers', '',',') ;
var threadBlock_names   = initialiseArray('threadBlock_names'  , '',',') ;
//   1 for ignore threads started by users, 2 for don't ignore threads started by users
var threadBlock_mode = initialise('threadBlock_mode', '1') ;

// invitePurger
//   Invite purger removes unwanted invites
var invitePurger_mode = initialise('invitePurger_mode', '2') ;

//==================================================================================================
// Ninja and welcome message
//==================================================================================================
// Ninja message id
//    Message number for sending ninja posts
var ninja_id = initialise('ninja_id', '-2') ;
var ninja_messageSubject = 'Welcome to greaseBox!' ;
var ninja_lines = new Array() ;
ninja_lines.push('Hi ' + user_name) ;
ninja_lines.push('Welcome to greaseBox!  This script will give you a better thingbox experience and help you manage your account more easily.') ;
ninja_lines.push('You can change the settings for greaseBox by visiting the control panel at ' + domain + '/account/welcome/greaseBox.  To enable/disable a module, just click the relevant button.') ;
ninja_lines.push('The most popular modules include Ripe to Reply, What\'s his face and user blocker.  You can also block adult/private galleries of users with the cock block module.  Organise your threads into all sorts of pretty colours using the thread categoriser (disabled by default, but very cool and useful nonetheless).') ;
ninja_lines.push('greaseBox is permanently in beta release, meaning that you shouldn\'t be surprised if you find a bug.  If you do, please let me know on the "greaseBox thread":' + domain + '/forums/thread/237074, or by sending me a message.  If you have any suggestions for new features, get in touch!  If I have time and it\s not unfeasible, I\'ll do it!  (Some requests are very easy to code up, but would lead to unreasonable demands on the thingbox server.  Others could lead to violations of privacy.  I won\'t make scripts fit either of these criteria.  Anything else is fine!)') ;
ninja_lines.push('Enjoy greaseBox!') ;
ninja_lines.push('"aidan":' + domain + '/members/profile/4913') ;
var ninja_messageBody = ninja_lines.join('\r\n\r\n') ;

// Welcome message
if(url.match('sendWelcomeMessage')) ninja_id = -1 ;
if(ninja_id=='-1') sendWelcomeMessage() ;
function sendWelcomeMessage(){
  var messageUrl = domain + '/messages/write/' + user_id ;
  var messageData = 'msg[subject]=' + ninja_messageSubject + '&msg[body]=' + ninja_messageBody + '&sendButton=send message' ;
  GM_xmlhttpRequest
	(
		{ 
			method: "POST",
			url: messageUrl,
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			data: messageData,
			onload: function(response){
				result = response.responseText ;
				getId('content').innerHMTL = result ;
				store('ninja_id', '0') ;
			}
		}
	) ;
}
ninja_id = retrieve('ninja_id', '-1') ;
if(ninja_id=='0') get_ninjaId() ;
function get_ninjaId(){
  for(var i=0 ; i<divs.length ; i++){
    if(divs[i].className=='toolbox'){
      var theH2s = divs[i].getElementsByTagName('h2') ;
      if(theH2s[0].innerHTML.match('new messages')){
        var lis = divs[i].getElementsByTagName('li') ;
        for(var j=0 ; j<lis.length ; j++){
          if(lis[j].getElementsByTagName('a')[0].innerHTML.match(ninja_messageSubject)){
            ninja_id = lis[j].getElementsByTagName('a')[0].href.split('/')[7] ;
            store('ninja_id', ninja_id) ;
            return ;
          }
        }
      }
    }
  }
}

//==================================================================================================
// Create modules
//==================================================================================================
function module(name, title, pageMode, enabled, locked, help){
  // pageMode: (bitmap)
  // 1: Regular pages
  // 2: Deskbox
  this.name     = name     ;
  this.title    = title    ;
  this.pageMode = pageMode ;
  this.enabled  = enabled  ;
  this.locked   = locked   ;
  this.hidden   = false    ;
  this.help     = help     ;
}
function doNothing(){ return ; }

// Declare modules
var modules = new Array() ;
modules.push(new module('blockBox'              , 'ThingBlocked'                   , 3, do_blockBox               , false , 'This module blocks all of Thingbox so you can\'t read or post anything.  If this module was enabled you wouldn\'t be able to read this page!')) ;
modules.push(new module('showSettings'          , 'greaseBox settings'             , 1, do_showSettings           , true  , 'This module shows the greaseBox settings page.')) ;
modules.push(new module('showHelp'              , 'greaseBox help'                 , 1, do_showHelp               , false , 'This module shows this page!')) ;
modules.push(new module('ignoreBox'             , 'Ignore dialogue box fixer'      , 1, do_ignoreBox              , false , 'This module removes the popup dialogue box that is triggered when ignoring threads.')) ;
modules.push(new module('fixIgnores'            , 'Fix multiply ignored threads'   , 1, do_fixIgnores             , false , 'This module checks your list ignored topics and makes sure each thread appears only once in the list.')) ;
modules.push(new module('fixLinks'              , 'Link fixer'                     , 1, do_fixLinks               , false , 'This module converts www.thingbox.com and www.myofficebox.com links to the correct domain.  Turns broken links into working links.')) ;
modules.push(new module('borderer'              , 'Border maker'                   , 1, do_borderer               , false , 'This module adds borders to most images.')) ;
modules.push(new module('beingAKittehsCool'     , 'Being a kitteh\'s cool!'        , 1, do_beingAKittehsCool      , false , 'This module replaces that godawful Being a Dickhead\'s Cool video with a <a href="http://1.bp.blogspot.com/_EXopv5BJbnY/Sw3iHTqsjgI/AAAAAAAACuc/wbLR22BdNOY/s1600/cute-kitten-9.jpg">picture of some kittens</a>.')) ;
modules.push(new module('imaginator'            , 'Links to images'                , 1, do_imaginator             , false , 'For all links to externals images this module adds the image to the end of a post.  You can choose to have the safe for work version. (This disables the module if the letters "NSFW" are found anywhere on the page.  The search for these letters is canse insenstiive.)')) ;
modules.push(new module('externalisedHomophobia', 'External links'                 , 1, do_externalisedHomophobia , false , 'This module edits external links.  When the mode is set to 1 it adds new links that open in a new window.  When the mode is set to 2 it changes existing links, forcing them to open in a new window.')) ;
modules.push(new module('getOutOfMyBox'         , 'Block users'                    , 1, do_getOutOfMyBox          , false , 'This module removes posts and messages from certain users.  Edit the source code to add/remove users from the list.')) ;
modules.push(new module('cockBlock'             , 'Cock blocker'                   , 1, do_cockBlock              , false , 'This module removes links to adult and private galleries of certain users.  Edit the source code to add/remove users from the list.')) ;
modules.push(new module('chokingHazard'         , 'Warning label'                  , 1, do_chokingHazard          , false , 'This module adds pointless nanny-state style warnings to the top of threads when certain users post.  Edit the source code to add/remove users from the list.')) ;
modules.push(new module('paintBox'              , 'Deskbox settings'               , 2, do_paintBox               , false , 'This module changes the background colour of deskbox depending on whether you have new messages or posts in tracked topics.')) ;
modules.push(new module('fareDodgers'           , 'Private gallery invite manager' , 1, do_fareDodgers            , false , 'This module keeps track of who has reciprocated private gallery invites, and adds links to the private galleries of the other members.')) ;
modules.push(new module('whatsHisFace'          , 'Links to galleries, logs'       , 3, do_whatsHisFace           , false , 'This module adds links to members galleries, activity logs, adult galleries and message pages.  Edit which links are shown, and in what order by editing the source code.')) ;
modules.push(new module('kitteh'                , 'Cute kitten overload'           , 1, do_kitteh                 , false , 'This module adds videos of cute kittens to the welcome page.  View a random kitteh at <a href="http://www.thingbox.com/account/welcome/kittens">this page</a> and a specific kitteh at <a href="http://www.thingbox.com/account/welcome/kitten=1">this page</a>.')) ;
modules.push(new module('envy'                  , 'Avatar replacer'                , 1, do_envy                   , false , 'This module replaces users\a avatars with other images.  penisEnvy: replace with penises!  bunnyEnvy: replace with bunnies!')) ;
modules.push(new module('hotTopics'             , 'Thread categoriser'             , 3, do_hotTopics              , false , 'This module lets you keep track of different threads by giving them different (colour coded) categories.  You can change the categories and colours by editing the source code.')) ;
modules.push(new module('first'                 , 'First post!'                    , 3, do_first                  , false , 'This module gives you a preview of the first post of a thread when you hover over the link to that thread.')) ;
modules.push(new module('threadBlock'           , 'Thread block'                   , 1, do_threadBlock            , false , 'This module auto-ignores threads for you.  It works if you visit http://www.thingbox.com/forums/list or if you hover over the link to a thread.')) ;
modules.push(new module('videoBlock'            , 'Video block'                    , 1, do_videoBlock             , false , 'This module auto-ignores threads with videos in the first post.  It works if you visit http://www.thingbox.com/forums/list or if you hover over the link to a thread.')) ;
modules.push(new module('fastForward'           , 'Fast forward'                   , 3, do_fastForward            , false , 'This module adds links to the ends of threads.')) ;
modules.push(new module('easyIgnore'            , 'Easy ignore'                    , 3, do_easyIgnore             , false , 'This module adds links that allow you ignore a thread without having to read it first.')) ;
modules.push(new module('ripeToReply'           , 'Ripe to Reply'                  , 1, do_ripeToReply            , false , 'This module makes it easier to quote other posts.  It should replicate the behaviour of ripeToReply.')) ;
modules.push(new module('friendsList'           , 'User lists'                     , 1, do_friendsList            , false , 'This module gives a simple list of friends when you visit the friends page of a user\'s profile.  It also works for group and event pages.')) ;
modules.push(new module('invitePurger'          , 'Invite purger'                  , 1, do_invitePurger           , false , 'This module removes unwanted invites.  There are two modes: one which hides the invites, and one which removes invites.')) ;
modules.push(new module('mailBox'               , 'New logo for the box'           , 1, do_mailBox                , false , 'This module swaps the Thingbox logo for something else.  Just for the LULZ.')) ;
modules.push(new module('guessWho'              , 'Avatar remover'                 , 1, do_guessWho               , false , 'This module removes avatars, for no adequately explored reason.')) ;
modules.push(new module('ninja'                 , 'Message without leaving tracks' , 1, do_ninja                  , false , 'This module allows you to message a user without having to visit their profile.')) ;

// Set executables
getModule('blockBox'              ).execute = function(){ execute_blockBox()               ; } ;
getModule('showSettings'          ).execute = function(){ execute_showSettings()           ; } ;
getModule('showHelp'              ).execute = function(){ execute_showHelp()               ; } ;
getModule('ignoreBox'             ).execute = function(){ execute_ignoreBox()              ; } ;
getModule('fixIgnores'            ).execute = function(){ execute_fixIgnores()             ; } ;
getModule('fixLinks'              ).execute = function(){ execute_fixLinks()               ; } ;
getModule('borderer'              ).execute = function(){ execute_borderer()               ; } ;
getModule('beingAKittehsCool'     ).execute = function(){ exceute_beingAKittehsCool()      ; } ;
getModule('imaginator'            ).execute = function(){ execute_imaginator()             ; } ;
getModule('externalisedHomophobia').execute = function(){ execute_externalisedHomophobia() ; } ;
getModule('getOutOfMyBox'         ).execute = function(){ execute_getOutOfMyBox()          ; } ;
getModule('cockBlock'             ).execute = function(){ execute_cockBlock()              ; } ;
getModule('chokingHazard'         ).execute = function(){ execute_chokingHazard()          ; } ;
getModule('paintBox'              ).execute = function(){ execute_paintBox()               ; } ;
getModule('fareDodgers'           ).execute = function(){ execute_fareDodgers()            ; } ;
getModule('whatsHisFace'          ).execute = function(){ execute_whatsHisFace()           ; } ;
getModule('kitteh'                ).execute = function(){ execute_kitteh()                 ; } ;
getModule('envy'                  ).execute = function(){ execute_envy()                   ; } ;
getModule('hotTopics'             ).execute = function(){ execute_hotTopics()              ; } ;
getModule('first'                 ).execute = function(){ execute_first()                  ; } ;
getModule('threadBlock'           ).execute = function(){ execute_threadBlock()            ; } ;
getModule('videoBlock'            ).execute = function(){ execute_threadBlock()            ; } ;
getModule('fastForward'           ).execute = function(){ execute_fastForward()            ; } ;
getModule('easyIgnore'            ).execute = function(){ execute_easyIgnore()             ; } ;
getModule('ripeToReply'           ).execute = function(){ execute_ripeToReply()            ; } ;
getModule('friendsList'           ).execute = function(){ execute_friendsList()            ; } ;
getModule('invitePurger'          ).execute = function(){ execute_invitePurger()           ; } ;
getModule('mailBox'               ).execute = function(){ execute_mailBox()                ; } ;
getModule('guessWho'              ).execute = function(){ execute_guessWho()               ; } ;
getModule('ninja'                 ).execute = function(){ execute_ninja()                  ; } ;

// Set updates
for(var i=0 ; i<modules.length ; i++){ modules[i].update = function() { doNothing() ; } }
getModule('imaginator'            ).update = function() { update_imaginator()             ; } ;
getModule('externalisedHomophobia').update = function() { update_externalisedHomophobia() ; } ;
getModule('getOutOfMyBox'         ).update = function() { update_getOutOfMyBox()          ; } ;
getModule('cockBlock'             ).update = function() { update_cockBlock()              ; } ;
getModule('chokingHazard'         ).update = function() { update_chokingHazard()          ; } ;
getModule('paintBox'              ).update = function() { update_paintBox()               ; } ;
getModule('fareDodgers'           ).update = function() { update_fareDodgers()            ; } ;
getModule('whatsHisFace'          ).update = function() { update_whatsHisFace()           ; } ;
getModule('envy'                  ).update = function() { update_envy()                   ; } ;
getModule('hotTopics'             ).update = function() { update_hotTopics()              ; } ;
getModule('threadBlock'           ).update = function() { update_threadBlock()            ; } ;

// Set names and numbers
getModule('getOutOfMyBox').numbers = getOutOfMyBox_numbers ; getModule('getOutOfMyBox').names  = getOutOfMyBox_names ;
getModule('cockBlock'    ).numbers = cockBlock_numbers     ; getModule('cockBlock'    ).names  = cockBlock_names     ;
getModule('chokingHazard').numbers = chokingHazard_numbers ; getModule('chokingHazard').names  = chokingHazard_names ;
getModule('fareDodgers'  ).numbers = fareDodgers_numbers   ; getModule('fareDodgers'  ).names  = fareDodgers_names   ;
getModule('threadBlock'  ).numbers = threadBlock_numbers   ; getModule('threadBlock'  ).names  = threadBlock_names   ;

//==================================================================================================
// Add greaseBox button
//==================================================================================================
if((do_showHelp=='true'||do_showSettings=='true') && deskbox==false && getId('greaseBox_status')==null){
  var span = create('span') ;
	span.className = 'awesome' ;
	span.style.margin = '1em' ;
	span.addEventListener("mouseup", function(e){ window.location=domain+'/account/welcome/greaseBox' ;},false) ;
	span.innerHTML = 'greaseBox' ; // settings and help' ;
	getId('toolbar').insertBefore(span, getId('toolbar').firstChild) ;
	logTitle('Added greaseBox button') ;
}

//==================================================================================================
// Arrange scripts in correct order
//==================================================================================================
if(getId('greaseBox_status')==null){
  var statusDiv = create('div') ;
	statusDiv.id = 'greaseBox_status' ;
	statusDiv.innerHTML = 'started' ;
	statusDiv.style.display = 'none' ;
	body.appendChild(statusDiv) ;
	for(var i=0 ; i<modules.length ; i++){
		//alert(i + ' ' + modules[i].name) ;
		logTitle([i] + ' Module: ' + modules[i].name) ;
		log('  Title: ' + modules[i].title) ;
		log('  enabled: ' + modules[i].enabled) ;
		if(modules[i].enabled=='true'){
			if(deskbox==true){
				if((modules[i].pageMode & 2)!=0) modules[i].execute() ;
			}
			else{
				if((modules[i].pageMode & 1)!=0) modules[i].execute() ;
			}
		}
	}
	
	// Fix home link
	for(var i=0 ; i<links.length ; i++){ if(links[i].innerHTML=='home'){ links[i].href = domain + '/account/welcome' ; break ; } }
}

//==================================================================================================
// Block box
//==================================================================================================
function execute_blockBox(){
  body.innerHTML = '' ;
  if(deskbox) return ;
  var div = create('div') ;
  div.id = 'content' ;
  body.appendChild(div) ;
	add('content','h2','greaseBox settings') ;
	addStyle('table#greaseBox{ border:1px solid #777777 ; width:90% ; margin:auto} th{font-size:16pt ; color:#ffffff ; background-color:#777777 ; padding:1em} td{font-size:12pt ; padding:1em} td.enabled{background-color:#ddffdd } td.disabled{background-color:#ffdddd} td{border-top:1px solid #777777}') ;
	
	var table = create('table') ;
	table.id = 'greaseBox' ;
	getId('content').appendChild(table) ;
	var thead ;
	var tbody ;
	var tr ;
	var th ;
	var td ;
	var span ;
	thead = create('thead') ; table.appendChild(thead) ;
	tr = create('tr') ; thead.appendChild(tr) ;
	th = create('th') ; th.innerHTML = 'Module' ; tr.appendChild(th) ;
	th = create('th') ; th.innerHTML = 'Status' ; tr.appendChild(th) ;
	th = create('th') ; th.innerHTML = '' ; tr.appendChild(th) ;
	
	tbody = create('tbody') ;
	table.appendChild(tbody) ;
	
	var i=0 ;
	tr = create('tr') ; tbody.appendChild(tr) ;
	td = create('td') ; td.innerHTML = modules[i].title ; tr.appendChild(td) ;
	td = create('td') ;
	td.id = 'td_' + modules[i].name + '_status' ;
	tr.appendChild(td) ;
	showSettings_tdStatus(i) ;
	
	td = create('td') ;
	td.id = 'td_' + modules[i].name + '_toggle' ;
	tr.appendChild(td) ;
	showSettings_tdToggle(i) ;
	
	span = create('span') ;
	span.className = 'awesome' ;
	span.style.margin = '1em' ;
	span.addEventListener("mouseup", function(e){ window.location=domain ;},false) ;
	span.innerHTML = 'home' ;
	div.appendChild(span) ;
}
// Block box

//==================================================================================================
// Show settings
//==================================================================================================
function execute_showSettings(){
  if(deskbox) return ;
  if(do_blockBox=='true') return ;
  if(!url.match(domain+'/account/welcome/greaseBox')) return ;
  do_kitteh = false ;
  
  getId('content').innerHTML = '' ;
	add('content','h2','greaseBox settings') ;
	
	addStyle('table#greaseBox{ border:1px solid #777777 ; width:90% ; margin:auto} th{font-size:16pt ; color:#ffffff ; background-color:#777777 ; padding:1em} td{font-size:12pt ; padding:1em} td{border-top:1px solid #777777} td.borderless_right, td.borderless_left{border-top:0px solid #777777 ; vertical-align:middle} td.borderless_right{text-align:right} td.borderless_left{text-align:left} td.top_align{vertical-align:top}') ;
		
	var table = create('table') ;
	table.id = 'greaseBox' ;
	getId('content').appendChild(table) ;
	var thead ;
	var tbody ;
	var tr ;
	var th ;
	var td ;
	var span ;
	var select ;
	var option ;
	var img ;
	var form ;
	var input ;
	thead = create('thead') ; table.appendChild(thead) ;
	tr = create('tr') ; thead.appendChild(tr) ;
	th = create('th') ; th.innerHTML = 'Module' ; tr.appendChild(th) ;
	th = create('th') ; th.innerHTML = 'Status' ; tr.appendChild(th) ;
	th = create('th') ; th.innerHTML = '' ; tr.appendChild(th) ;
	
	tbody = create('tbody') ;
	table.appendChild(tbody) ;
	
	for(var i=0 ; i<modules.length ; i++){
	  tr = create('tr') ;
	  tbody.appendChild(tr) ;
	  
	  td = create('td') ;
	  td.innerHTML = modules[i].title ;
	  tr.appendChild(td) ;
	  
	  td = create('td') ;
	  td.id = 'td_' + modules[i].name + '_status' ;
    tr.appendChild(td) ;
    showSettings_tdStatus(i) ;
		
    td = create('td') ;
    td.id = 'td_' + modules[i].name + '_toggle' ;
    tr.appendChild(td) ;
    showSettings_tdToggle(i) ;
    
    switch(modules[i].name){
    case 'imaginator':
    	showSettings_dropDownSettings(tbody, i, ['1','2'], ['Exclude images when "NSFW" appears on page', 'Include all images'], imaginator_mode) ;
      break ;
    
    case 'externalisedHomophobia':
	    showSettings_dropDownSettings(tbody, i, ['1','2'], ['Create new links that open in new window', 'Force existing links to open in new window'], externalisedHomophobia_mode) ;
      break ;
    
    case 'envy':
      showSettings_dropDownSettings(tbody, i, ['1','2'], ['Show cocks', 'Show bunnies'], envy_mode) ;
      break ;
    
    case 'paintBox':
      showSettings_dropDownSettings(tbody, i, ['1','2'], ['Show friends in deskbox', 'Hide friends in deskbox'], paintBox_mode) ;
      break ;
      
    case 'invitePurger':
      showSettings_dropDownSettings(tbody, i, ['1','2'], ['Hide invites', 'Add "purge invites" button'], invitePurger_mode) ;
      break ;
    
    case 'whatsHisFace':		
			var options = [ 'E' , 'G' , 'L' , 'A' , 'M' ] ;
			var descriptions = [ 'Empty' , 'Gallery' , 'Activity log' , 'Adult gallery' , 'Message' ] ;
			for(var j=1 ; j<5 ; j++){
			  tr = create('tr') ; tbody.appendChild(tr) ;
			  td = create('td') ; td.className = 'borderless_right' ; td.innerHTML = '' ; tr.appendChild(td) ; td.appendChild(showSettings_waitImage(i)) ;
			  td = create('td') ; td.className = 'borderless_left' ; td.colSpan = 2 ;
			  td.innerHTML = 'Link #' + j + ': ' ;
				
			  var chosen = whatsHisFace_mode.substring(j-1,j) ;
			  select = create('select') ;
			  select.id = modules[i].name + '_settings_' + j ;
			  for(var k=0 ; k<options.length ; k++){
				option = create('option') ;
				option.value = 'settings_' + modules[i].name + '_' + j + '_' + options[k] ;
				option.innerHTML = descriptions[k] ;
				if(options[k]==chosen) option.selected = 'selected' ;
				select.appendChild(option) ;
			  }
			  select.addEventListener("mouseup", function(e){ showSettings_setWhatsHisFaceMode(e) ;},false) ;
			  td.appendChild(select) ;
			  tr.appendChild(td) ;
			}
      break ;
    
    case 'threadBlock':
  	  showSettings_dropDownSettings(tbody, i, ['1','2'], ['Automatically ignore threads from blocked users', 'Don\'t automatically ignore threads from blocked users'], threadBlock_mode) ;
  	  showSettings_listSettings(tbody, i) ;
	  showSettings_searchBox(tbody, i) ;
      break ;
      
    case 'fareDodgers':
      tr = create('tr') ; tbody.appendChild(tr) ;
  	  td = create('td') ; td.className = 'borderless_left' ; td.colSpan = 3 ; td.innerHTML = 'Blacklist:' ; tr.appendChild(td) ;
      showSettings_listSettings(tbody, i) ;
	  showSettings_searchBox(tbody, i) ;
      break ;
  	
  	case 'getOutOfMyBox':
    case 'cockBlock':
    case 'chokingHazard':
    case 'fareDodgers':
    case 'threadBlock':
      showSettings_listSettings(tbody, i) ;
	  showSettings_searchBox(tbody, i) ;
      break ;    
    
    case 'hotTopics':
    	for(var j=0 ; j<hotTopics_titles.length ; j++){
    		tr = create('tr') ;
    		tbody.appendChild(tr) ;	
				
				td = create('td') ;
				td.className = 'borderless_right' ;
				td.appendChild(showSettings_waitImage(i)) ;
				input = create('input') ;
				input.type = 'text' ;
				input.id = 'showSettings_hotTopics_' + j + '_title' ;
				input.value = hotTopics_titles[j] ;
				td.appendChild(input) ;
				tr.appendChild(td) ;
				
				td = create('td') ;
				td.className = 'borderless_left' ;
				select = create('select') ;
				select.id = 'showSettings_hotTopics_' + j + '_color' ;
				for(var k=0 ; k<hotTopics_displayColors.length ; k++){
				  option = create('option') ;
				  option.value     = k ;
				  option.innerHTML = hotTopics_buttonColors[k] ;
				  option.style.backgroundColor = hotTopics_displayColors[k] ;
				  select.appendChild(option) ;
				  if(hotTopics_colors[j]==select.options[k].value) select.options[k].selected = 'selected' ;
				}
				td.appendChild(select) ;
				tr.appendChild(td) ;
				
				td = create('td') ;
				td.className = 'borderless_left' ;
				span = create('span') ;
				span.className = 'awesome blue' ;
				span.innerHTML = 'update' ;
				span.id = 'showSettings_hotTopics_update_' + j ;
				span.addEventListener("mouseup", function(e){ showSettings_updateHotTopics(e) ;},false) ;
				td.appendChild(span) ;
				
				td.appendChild(create('br')) ;
				span = create('span') ;
				span.className = 'awesome red' ;
				span.innerHTML = 'remove' ;
				span.id = 'showSettings_hotTopics_remove_' + j ;
				span.addEventListener("mouseup", function(e){ showSettings_removeHotTopics(e) ;},false) ;
				td.appendChild(span) ;
				tr.appendChild(td) ;
			}
			
			tr = create('tr') ;
			tbody.appendChild(tr) ;	
			
			td = create('td') ;
			td.className = 'borderless_right' ;
			td.appendChild(showSettings_waitImage(i)) ;
			input = create('input') ;
			input.type = 'text' ;
			input.value = '' ;
			input.id = 'showSettings_hotTopicsNew_title' ;
			td.appendChild(input) ;
			tr.appendChild(td) ;
			
			td = create('td') ;
			td.className = 'borderless_left' ;
			select = create('select') ;
			select.id = 'showSettings_hotTopicsNew_color' ;
			for(var k=0 ; k<hotTopics_displayColors.length ; k++){
				option = create('option') ;
				option.value     = k ;
				option.innerHTML = hotTopics_buttonColors[k] ;
				option.style.backgroundColor = hotTopics_displayColors[k] ;
				select.appendChild(option) ;
		  }
			
			td.appendChild(select) ;
			tr.appendChild(td) ;
			
			td = create('td') ;
			td.className = 'borderless_left' ;
			span = create('span') ;
			span.className = 'awesome blue' ;
			span.innerHTML = 'add' ;
			span.addEventListener("mouseup", function(e){ showSettings_addHotTopics(e) ;},false) ;
			td.appendChild(span) ;
			tr.appendChild(td) ;
			
    	break ;
    
		default : break ;
    }
	}
}
function showSettings_tdStatus(i){
  var td = getId('td_' + modules[i].name + '_status') ;
  td.innerHTML = (modules[i].enabled=='true') ? 'enabled' : 'disabled' ;
  td.className = (modules[i].enabled=='true') ? 'enabled' : 'disabled' ;
}
function showSettings_tdToggle(i){
  var td = getId('td_' + modules[i].name + '_toggle') ;
  td.innerHTML = '' ;
  if(modules[i].locked==false){
    span = create('span') ;
    if(modules[i].enabled=='true' ){
      span.className = 'awesome red' ;
      span.innerHTML = 'disable' ;
    }
    else{
      span.className = 'awesome green' ;
      span.innerHTML = 'enable' ;
    }
    span.id = 'showSettings_toggle_' + modules[i].name ;
  	span.addEventListener("mouseup", function(e){ showSettings_toggleModule(e) ;},false) ;
    td.appendChild(span) ;
	}
}
function showSettings_toggleModule(e){
  var name = e.target.id.split('_')[2] ;
  for(var i=0 ; i<modules.length ; i++){
    if(modules[i].name==name){
      if(modules[i].locked==true) return ;
      if(modules[i].enabled=='true'){
        modules[i].enabled = 'false' ;
      }
      else{
        modules[i].enabled = 'true' ;
      }
      store('do_'+modules[i].name, modules[i].enabled) ;
      showSettings_tdStatus(i) ;
      showSettings_tdToggle(i) ;
      if(modules[i].enabled) modules[i].execute() ;
      if(do_blockBox) execute_blockBox() ;
      return ;
    }
  }
}
function showSettings_waitImage(i){
  var img = create('img') ;
	img.alt = 'Wait' ;
	img.src = 'http://img1.thingbox.net/images/ui/wait.gif' ;
	img.id = 'wait_' + modules[i].name ;
	img.style.display = 'none' ;
	return img ;
}
function showSettings_dropDownSettings(tbody, i, options, descriptions, chosen){
  var tr = create('tr') ;
  var td ;
  var select ;
  var option ;
  var span ;
  tbody.appendChild(tr) ;
	td = create('td') ; td.className = 'borderless_right' ; td.colSpan = 2 ; td.appendChild(showSettings_waitImage(i)) ;
	select = create('select') ;
	select.id = modules[i].name + '_settings' ;
	
	for(var j=0 ; j<options.length ; j++)
	{
	  option = create('option') ;
	  option.value = 'settings_' + modules[i].name + '_' + options[j] ;
	  option.innerHTML = descriptions[j] ;
	  if(options[j]==chosen) option.selected = 'selected' ;
	  select.appendChild(option) ;
    }
	select.addEventListener("mouseup", function(e){ showSettings_setMode(e) ;},false) ;
	td.appendChild(select) ;
	tr.appendChild(td) ;
	
	td = create('td') ;
	td.className = 'borderless_left' ;
	span = create('span') ;
	span.innerHTML = 'update' ;
	span.className = 'awesome blue' ;
	span.id = modules[i].name + '_span' ;
	span.addEventListener("mouseup", function(e){ showSettings_setMode(e) ;},false) ;
	td.appendChild(span) ;
	tr.appendChild(td) ; 
}
function showSettings_listSettings(tbody, i){
  var tr ;
  var td ;
  var span ;
  var numbers = modules[i].numbers ;
  var names   = modules[i].names   ;
  
  for(var j=0 ; j<numbers.length ; j++){
    if(numbers[j]=='') continue ;
    tr = create('tr') ;
    td = create('td') ;
    td.className = 'borderless_right' ;
    td.appendChild(showSettings_waitImage(i)) ;
    tr.appendChild(td) ;
	  
	  td = create('td') ;
	  td.className = 'borderless_left' ;
	  td.innerHTML = names[j] ;
	  td.style.textAlign = 'right' ;
	  tr.appendChild(td) ;
	  
	  td = create('td') ;
	  td.className = 'borderless_left' ;
	  span = create('span') ;
	  span.innerHTML = 'remove' ;
	  span.id = modules[i].name + '_' + numbers[j] + '_' + names[j] ;
	  span.className = 'awesome red' ;
		span.addEventListener("mouseup", function(e){ showSettings_removeUser(e) ;},false) ;
	  td.appendChild(span) ;
	  tr.appendChild(td) ;
	  tbody.appendChild(tr) ;
  }
}
function showSettings_setMode(e){
  var name = e.target.id.split('_')[0] ;
  var value = getId(name + '_settings').value.split('_')[2] ;
  getId('wait_'+name).style.display = '' ;
  store(name+'_mode', value) ;
  if(getModule(name).enabled=='true') getModule(name).execute() ; // Force update of settings
  window.setTimeout("document.getElementById('wait_"+name+"').style.display = 'none'", delay) ;
}
function showSettings_setWhatsHisFaceMode(e){
  var number = e.target.value.split('_')[2] ;
  var letter = e.target.value.split('_')[3] ;
  var value = '' ;
  for(var i=0 ; i<whatsHisFace_mode.length ; i++){
    if(number==i+1){
      value = value + letter ;
    }
    else{
      value = value + whatsHisFace_mode.substring(i,i+1) ;
    }
  }
  store('whatsHisFace_mode', value) ;
  whatsHisFace_mode = retrieve('whatsHisFace_mode', whatsHisFace_mode) ;
}
function showSettings_autocomplete(e){
  var result ;
  var select ;
  var option ;
  var numberOfMatches = 0 ;
  var lastMatch = -1 ;
  var searchUrl = domain + '/members/search_username?q=' + e.target.value ;
  if(e.target.value.length>2){
    GM_xmlhttpRequest
		(
			{ 
				method: "GET",
				url: searchUrl, 
				onload: function(response){
          result = response.responseText ;
          result = result.substring(1,result.length-2).split(',') ;          
          select = getId(e.target.id.split('_')[0]+"_memberSearch_select") ;
          select.innerHTML = '' ;
          option = create('option') ;
        	option.value = '0_NONE' ;
          option.innerHTML = ' -- Select user -- ' ;
          select.appendChild(option) ;
          if(numberOfMatches==1) select.options[0].selected = 'selected' ;
          
          numberOfMatches =  0 ;
          lastMatch       = -1 ;
          if(result.length>1){
	          for(var i=0 ; i<result.length ; i+=3){
  	          option = create('option') ;
    	        option.value = result[i+1].split(':')[1]+'_'+result[i+2].split('"')[3] ;
      	      option.innerHTML = result[i+2].split('"')[3] ;
        	    select.appendChild(option) ;
          	  
            	if(result[i+2].split('"')[3].toLowerCase().match(e.target.value.toLowerCase())){
         	     numberOfMatches++ ;
          	    lastMatch = i+1 ;
            	}
            }
          }
          select.size = select.options.length ;
          if(numberOfMatches==1) select.options[lastMatch].selected = 'selected' ;
				}
			}
		) ;
  }
}
function showSettings_addUser(e){
  var moduleName = e.target.id.split('_')[0] ;
  var select = getId(moduleName + '_memberSearch_select') ;
  var value = select.options[select.selectedIndex].value ;
  var number = value.split('_')[0] ;
  var name   = value.split('_')[1] ;
  if(number==0) return ;
  var numbers = retrieve(moduleName+'_numbers', '') ;
  var names   = retrieve(moduleName+'_names'  , '') ;
  for(var i=0 ; i<numbers.split(',').length ; i++){ if(numbers.split(',')[i]==number) return ; }
  numbers = numbers + ',' + number ;
  names   = names   + ',' + name ;
  store(moduleName+'_numbers', numbers) ;
  store(moduleName+'_names'  , names) ;
  getModule(moduleName).update() ;
  execute_showSettings() ;
  if(do_showHelp) execute_showHelp() ;
}
function showSettings_removeUser(e){
  var moduleName = e.target.id.split('_')[0] ;
  var number     = e.target.id.split('_')[1] ;
  var name       = e.target.id.split('_')[2] ;
  if(number==0) return ;
  var numbers = retrieve(moduleName+'_numbers', '').split(',') ;
  var names   = retrieve(moduleName+'_names'  , '').split(',') ;
  var newNumbers = '' ;
  var newNames   = '' ;
  for(var i=0 ; i<numbers.length ; i++){
    if(numbers[i]==number) continue ;
    newNumbers = newNumbers + numbers[i] + ',' ;
    newNames   = newNames   + names[i]   + ',' ;
  }
  numbers = newNumbers.substring(0,newNumbers.length-1) ;
  names   = newNames.substring(  0,newNames.length-1  ) ;
  store(moduleName+'_numbers', numbers) ;
  store(moduleName+'_names'  , names) ;
  getModule(moduleName).update() ;
  execute_showSettings() ;
  if(do_showHelp=='true') execute_showHelp() ;
}
function showSettings_searchBox(tbody, i){
	var tr ;
	var td ;
	var input ;
	var select ;
	var option ;
	var span ;
	
	tr = create('tr') ;
	tbody.appendChild(tr) ;
	
	td = create('td') ;
	td.className = 'borderless_right top_align' ;
	td.innerHTML = '' ;
	td.appendChild(showSettings_waitImage(i)) ;
	
	input = create('input') ;
	input.id = modules[i].name + '_memberSearch' ;
	input.name = 'username' ;
	input.type = 'text' ;
	input.addEventListener("keyup", function(e){ showSettings_autocomplete(e) ;},false) ;
	td.appendChild(input) ;
	tr.appendChild(td) ;
	
	td = create('td') ;
	td.className = 'borderless_right top_align' ;
	select = create('select') ;
	select.id = modules[i].name + '_memberSearch_select' ;
	option = create('option') ;
	option.value = '0_NONE' ;
	option.innerHTML = ' -- Select user -- ' ;
	select.appendChild(option) ;
	td.appendChild(select) ;
	tr.appendChild(td) ;
	
	td = create('td') ;
	td.className = 'borderless_left top_align' ;
	span = create('span') ;
	span.className = 'awesome blue' ;
	span.innerHTML = 'add' ;
	span.id = modules[i].name + '_add' ;
	span.addEventListener("mouseup", function(e){ showSettings_addUser(e) ;},false) ;
	td.appendChild(span) ;
	tr.appendChild(td) ;
}
function showSettings_updateHotTopics(e){
  var number = e.target.id.split('_')[3] ;
  hotTopics_titles[number] = getId('showSettings_hotTopics_' + number + '_title').value.replace(';','').replace(',','') ;
  hotTopics_colors[number] = getId('showSettings_hotTopics_' + number + '_color').value ;
  store('hotTopics_titles', hotTopics_titles.join(',')) ;
  store('hotTopics_colors', hotTopics_colors.join(',')) ;
  getModule('hotTopics').update() ;
  execute_showSettings() ;
  if(do_showHelp) execute_showHelp() ;
}
function showSettings_removeHotTopics(e){
  var number = e.target.id.split('_')[3] ;
  var newHotTopicsLists  = new Array() ;
  var newHotTopicsTitles = new Array() ;
  var newHotTopicsColors = new Array() ;
  var counter = 0 ;
  for(var i=0 ; i<hotTopics_titles.length ; i++){
    if(i!=number){
      newHotTopicsLists[counter]  = hotTopics_lists[i] ;
      newHotTopicsTitles[counter] = hotTopics_titles[i].replace(';','').replace(',','') ;
      newHotTopicsColors[counter] = hotTopics_colors[i] ;
      counter = counter + 1 ;
    }
  }
  store('hotTopics_lists' , newHotTopicsLists.join(',') ) ;
  store('hotTopics_titles', newHotTopicsTitles.join(',')) ;
  store('hotTopics_colors', newHotTopicsColors.join(',')) ;
  getModule('hotTopics').update() ;
  execute_showSettings() ;
  if(do_showHelp) execute_showHelp() ;
}
function showSettings_addHotTopics(e){
  hotTopics_lists[hotTopics_lists.length] = '' ;
  hotTopics_titles[hotTopics_titles.length] = getId('showSettings_hotTopicsNew_title').value.replace(';','').replace(',','') ;
  hotTopics_colors[hotTopics_colors.length] = getId('showSettings_hotTopicsNew_color').value ;
  store('hotTopics_lists' , hotTopics_lists.join(';') ) ;
  store('hotTopics_titles', hotTopics_titles.join(',')) ;
  store('hotTopics_colors', hotTopics_colors.join(',')) ;
  getModule('hotTopics').update() ;
  execute_showSettings() ;
  if(do_showHelp=='true') execute_showHelp() ;
}
// Show settings

//==================================================================================================
// Show help
//==================================================================================================
function execute_showHelp(){
  if(deskbox) return ;
  if(do_blockBox=='true') return ;
  if(!url.match(domain+'/account/welcome/greaseBox')) return ;
  do_kitteh = false ;
   
  addStyle('dt{ font-size:14pt ; margin-top:1em ; } dd{ font-size:10pt ; margin-left:2em ; margin-top:1em ; } span.enabled{ background-color:#ddffdd } span.disabled{ background-color:#ffdddd }') ;
  
  if(!do_showSettings) getId('content').innerHTML = '' ;
	add('content','h2','greaseBox help') ;
	add('content','p','Here is a list of the modules included in greaseBox in the order of their execution, and a description of what they do.') ;
	add('content','p','<a href="http://www.aidansean.com/greasemonkey/greaseBox.php">Homepage</a>') ;
	
	var dl = create('dl') ;
  dl.id = 'greaseBox_help' ;
  getId('content').appendChild(dl) ;
  for(var i=0 ; i<modules.length ; i++){ showHelp_addHelp(modules[i].title, modules[i].help, modules[i].enabled) ; }
}
function showHelp_showStatus(flag){
  return '' ;
  if(flag) return '<span class="enabled">(enabled)</span>' ;
  return '<span class="disabled">(disabled)</span>' ;
}
function showHelp_addHelp(name, help, flag){
	add('greaseBox_help','dt',name + ' ' + showHelp_showStatus(flag)) ;
	add('greaseBox_help','dd',help) ;
}
// Show help

//==================================================================================================
// Ignore box
//==================================================================================================
function execute_ignoreBox(){
  for(var i=0 ; i<links.length ; i++){
    if(links[i].innerHTML=='ignore topic'){
      var link = create('a') ;
      link.href      = links[i].href ;
      link.innerHTML = links[i].innerHTML ;
      link.className = links[i].className ;
      links[i].parentNode.insertBefore(link, links[i]) ;
      links[i].parentNode.removeChild(links[i].nextSibling) ;
      return ;
    }
  }
}
// Ignore box

//==================================================================================================
// Fix ignores
//==================================================================================================
function execute_fixIgnores(){
  if(deskbox) return ;
  var regex = /forums\/ignored/ ;
  if( url.search(regex)==-1 ) return ;
  var span = create('span') ;
  span.className = 'awesome' ;
  span.style.margin = '1em' ;
  span.addEventListener("mouseup", function(){ do_fixIgnores() ; },false) ;
  span.innerHTML = 'Fix ignored topics' ;
  span.id = 'fixIgnores_button' ;
  getId('content').insertBefore(span, getId('content').firstChild) ;
  logTitle('Added fixIgnores button') ;
}
function do_fixIgnores(){
  if(deskbox) return ;
  var regex = /forums\/ignored/ ;
  if( url.search(regex)==-1 ) return ;
  var nPages = -1 ;
  for(var i=0 ; i<links.length ; i++){
    if(links[i].href.search('/forums/ignored/')!='-1'){
      var parts = links[i].href.split("/") ;
      var n = parts[parts.length-1] ;
      if(1*n>nPages) nPages = n ;
    }
  }
  var threads  = new Array() ;
  var nIgnores = new Array() ;
  
  // Retrieve users using AJAX
  var pageUrls    = new Array() ;
  var threadLinks = new Array() ;
  var AJAXCounter = 0 ;
  var counter     = 0 ;
  for(var i=0 ; i<nPages ; i++){
	pageUrls[i] = domain + '/forums/ignored/'+ (i+1) ;
	GM_xmlhttpRequest
	(
	  {
		method: "GET",
		url: pageUrls[i],
		onload: function(response){
		  AJAXCounter++ ;
		  var lines = response.responseText.split('\n') ;
		  for(var j=0 ; j<lines.length ; j++){
			if(lines[j].match(/\s*<a href="\/forums\/ignore_stop\/[0-9]+"\sclass="stop_ignoring awesome red">/)){
			  threadLinks[counter] = lines[j].split('href="')[1].split('"')[0].split("/")[3] ;
			  counter++ ;
			}
		  }
		  if(AJAXCounter==nPages){
			counter = 0 ;
			
			for(var j=0 ; j<threadLinks.length ; j++){
			  var add_thread = true ;
			  for(var k=0 ; k<threads.length ; k++){
			    if(threadLinks[j]==threads[k]){
			      add_thread = false ;
			      nIgnores[k] = nIgnores[k] + 1 ;
			      break ;
			    }
			  }
			  if(add_thread==true){
				threads[counter]  = threadLinks[j] ;
				nIgnores[counter] = 1 ;
				counter++ ;
			  }
			}
            // Do ignores here
            var ignoreCounter = 0 ;
            var nToIgnore = 0 ;
            for(var k=0 ; k<threads.length ; k++){
              for(var l=0 ; l<nIgnores[k]-1 ; l++){
                nToIgnore++ ;
              }
            }
            var div = create('div') ;
			if(debug){
			  for(var k=0 ; k<threads.length ; k++){
			    if(nIgnores[k]>1) div.innerHTML = div.innerHTML + '<br />' + nIgnores[k] + ' ' + threads[k] ;
			  }
			  getId('content').appendChild(div) ;
            }
            var img = create('img') ;
	        img.alt = 'Wait' ;
	        img.src = 'http://img1.thingbox.net/images/ui/wait.gif' ;
	        img.id = 'wait_fixIgnores' ;
	        img.style.display = '' ;
            getId('content').insertBefore(img, getId('fixIgnores_button')) ;
            
            for(var k=0 ; k<threads.length ; k++){
              for(var l=0 ; l<nIgnores[k]-1 ; l++){
                var ignoreUrl = domain + "/forums/ignore_stop/" + threads[k] ;
                GM_xmlhttpRequest
	            (
	              {
		            method: "GET",
		            url: ignoreUrl,
		            onload: function(response){
		              ignoreCounter++ ;
		              if(ignoreCounter==nToIgnore){
		                getId('wait_fixIgnores').style.display = 'none' ;
		              }
		            }
		          }
		        ) ;
              }
            }
		  }
	    }
      }
    ) ;
  }
}
// Ignore box

//==================================================================================================
// Fix links
//==================================================================================================
function execute_fixLinks(){
  if(deskbox) return ;
  var urlMatch = url.substring(0,url.length-1) ;
  var urlNinja = domain + '/messages/reply/' + user_id ;
  for(var i=0 ; i<links.length ; i++){
    if(links[i].href.match(urlMatch)){
      if(links[i].href.split(urlMatch)[1].match('.(com|co.uk|net|org)$')){
        links[i].href = 'http://' + links[i].href.split(urlMatch)[1] ;
      }
    }
    if(links[i].href.match(regex_bothbox)){
      links[i].href = domain + '/' + links[i].href.split('com/')[1] ;
    }
  }
}
// Fix links

//==================================================================================================
// Borderer
//==================================================================================================
function execute_borderer(){
  if(deskbox) return ;
	addStyle('.jcarousel-item, .jcarousel-skin-tango, .jcarousel-clip, .jcarousel-clip-horizontal {height:64px!important;}') ;
	
	var theImgs = getId('content').getElementsByTagName('img') ;
	for(var i=0 ; i<theImgs.length ; i++){
		if(theImgs[i].className.match('plip|success|warning')) continue ;
		if(theImgs[i].parentNode.className=='profile') continue ;
		if(theImgs[i].parentNode.tagName=='SPAN')      continue ;
		if(theImgs[i].id=='wait')                      continue ;
		if(theImgs[i].alt=='Wait')                     continue ;
		theImgs[i].style.border = '1px solid black' ;
		theImgs[i].style.padding = '1px' ;
	}
	
	for(var i=0 ; i<imgs.length ; i++){
		if(imgs[i].className=='headshot'){
			imgs[i].style.border = '1px solid black' ;
			imgs[i].style.padding = '1px' ;
		}
	}
}
// Borderer

//==================================================================================================
// Being a Kitteh's Cool!
//==================================================================================================
function exceute_beingAKittehsCool(){
  if(deskbox) return ;
  var kitten = create('img') ;
  kitten.src = 'http://1.bp.blogspot.com/_EXopv5BJbnY/Sw3iHTqsjgI/AAAAAAAACuc/wbLR22BdNOY/s1600/cute-kitten-9.jpg' ;
  kitten.style.width  = '438px' ;
  kitten.style.height = '480px' ;
  kitten.style.border = '1px solid black' ;
  kitten.alt = 'Being a kitten\'s cool!' ;

  // Values of youtube parameter
  var youtubeUrls = new Array() ;
  youtubeUrls[0] = 'http://www.youtube.com/v/lVmmYMwFj1I' ;

  var params = document.getElementsByTagName('param') ;
  for(var i=0 ; i<params.length ; i++){
    for(var j=0 ; j<youtubeUrls.length ; j++){
      if(params[i].value==youtubeUrls[j]){
        params[i].parentNode.parentNode.appendChild(kitten, params[i]) ;
        params[i].parentNode.parentNode.removeChild(params[i].parentNode) ;
        break ;
      }
    }
  }
}
// Being a Kitteh's Cool!

//==================================================================================================
// Imaginator
//==================================================================================================
function execute_imaginator(){
  if(deskbox) return ;
  imaginator_mode = retrieve('imaginator_mode', '1') ;
	var extensions = [ 'jpg' , 'jpeg' , 'gif' , 'png' ] ;
	var SFW = true ;
	var imagesOnPage = new Array() ;
	if(getId('postings')==null) return ;
	var postings = getId('postings').innerHTML.toLowerCase() ;
	if(postings.match('nsfw')) SFW = false ;
	if(SFW || imaginator_mode=='2'){
		for(var i=0 ; i<links.length ; i++){
			var showImage = false ;
			for(var j=0 ; j<extensions.length ; j++){
				var pattern = '\.' + extensions[j] + '$' ;
				if(links[i].href.match(pattern) ){
					showImage = true ;
					for(var k=0 ; k<imagesOnPage.length ; k++){
						if(links[i].href==imagesOnPage[k]) showImage = false ;
					}
				}
			}
			if(links[i].href=='http://img.chan4chan.com/img/2009-11-28/i00wn4mmk6r96rp64j0y.jpg') showImage = false ; // Hobgoblin is an e-Terrorist!
			if(showImage){
				var p = document.createElement('p') ;
				p.style.textAlign = 'center' ;
				p.innerHTML = '<img src="' + links[i].href + '" style="border:1px solid black;margin:auto"/>' ;
				links[i].parentNode.parentNode.appendChild(p) ;
				imagesOnPage[imagesOnPage.length] = links[i].href ;
			}
		}
	}
}
function update_imaginator() { imaginator_mode = retrieve('imaginator_mode', '1') ; }
// Imaginator

//==================================================================================================
// Externalised homophobia
//==================================================================================================
function execute_externalisedHomophobia(){
  if(deskbox) return ;
  var externalisedHomophobia_mode = retrieve('externalisedHomophobia_mode', '2') ;
	var script_links = create('script') ;
	script_links.type = 'text/javascript' ;
	script_links.innerHTML = 'function externalLinks()\n{\nif(!document.getElementsByTagName)return;\nvar anchors=document.getElementsByTagName("a");\nfor(var i=0; i<anchors.length; i++)\n{\nif(anchors[i].getAttribute("href") && anchors[i].getAttribute("rel")) if(anchors[i].getAttribute("rel").match("external")) anchors[i].target = "_blank";\n}\n}' + '\n\nwindow.onload = function(){externalLinks();}' ;
	head.appendChild(script_links) ;
	
	var oldLinks = new Array() ;
  var newLinks = new Array() ;
  var counter = 0 ;
	
	// Search through all links on the page
	for(var i=0 ; i<links.length ; i++){
		// Exclude links to thingbox and myofficebox
		if(links[i].href!='' && !links[i].href.match(regex_bothbox)){
		  switch(externalisedHomophobia_mode){
		  case '1':
		    var externalLink = document.createElement('span') ;
        externalLink.innerHTML = ' <a href="' + links[i].href + '" rel="external" style="color:crimson">+</a> ' ;
        // Save information in separate lists, so that the length of links remains static
        oldLinks[counter] = links[i] ;
        newLinks[counter] = externalLink ;
        counter++ ;
        break ;
		  
		  case '2':
			  links[i].style.color = 'crimson' ;
			  links[i].rel = 'external' ;
			  break ;
			}
		}
	}
	switch(externalisedHomophobia_mode)
  {
  case '1':
	  for(var i=0 ; i<oldLinks.length ; i++){
      if(oldLinks[i].parentNode.lastchild == oldLinks[i]){
        oldLinks[i].parentNode.appendChild(newLinks[i]) ;
      }
      else{
        oldLinks[i].parentNode.insertBefore(newLinks[i], oldLinks[i].nextSibling) ;
      }
    }
    break ;
    
  default : break ;
  }
}
function update_externalisedHomophobia() { externalisedHomophobia_mode = retrieve('externalisedHomophobia_mode', '2') ; }
// Externalised homophobia

//==================================================================================================
// Get out of my box!
//==================================================================================================
function execute_getOutOfMyBox(){
  getOutOfMyBox_numbers = retrieve('getOutOfMyBox_numbers', '3024').split(',') ;
  var tags     = new Array() ;
  var regex    = new Array() ;
  var property = new Array() ; // 1=id, 2=class
  tags[0] = 'div'  ; regex[0] = 'bmw'               ; property[0] = 1 ; // Forum posts
  tags[1] = 'tr'   ; regex[1] = 'row_(dark|light)'  ; property[1] = 2 ; // Messages
  tags[2] = 'span' ; regex[2] = 'headshot_wrap'     ; property[2] = 2 ; // Headshots
  
  for(var h=0 ; h<tags.length ; h++){
    var elements = getTags(tags[h]);
		for(var i=0 ; i<elements.length ; i++){
		  	var prop = '' ;
		  	switch(property[h]){
		    	case 1: prop = elements[i].id        ; break ;
		    	case 2: prop = elements[i].className ; break ;
		    	default : return ;
		  	}
			if(prop.match(regex[h])){
				var theLinks = elements[i].getElementsByTagName('a') ;
				for(var j=0 ; j<theLinks.length ; j++){
					for(var k=0 ; k<getOutOfMyBox_numbers.length ; k++){
					  if(getOutOfMyBox_numbers[k]=='') continue ;
						if(theLinks[j].href.match(memberLinkRegex(getOutOfMyBox_numbers[k]))){
							elements[i].style.display = 'none' ;
						}
					}
				}
			}
		}
	}
	
	for(var i=links.length-1 ; i>-1 ; i--){
		for(var j=0 ; j<getOutOfMyBox_numbers.length ; j++){
	    	if(getOutOfMyBox_numbers[j]=='') continue ; 
	    	if(links[i].href.match(memberGalleryLinkRegex(getOutOfMyBox_numbers[j]))) {
        		links[i].parentNode.parentNode.removeChild(links[i].parentNode) ;
        	}
        }
	}
	
	var theDiv ;
	for(var i=0 ; i<divs.length ; i++){
	  if(divs[i].className=='wrapper one_row') theDiv = divs[i] ;
	}
	if(theDiv!=null){
		theLinks = theDiv.getElementsByTagName('a') ;
		for(var i=theLinks.length-1 ; i>-1 ; i--){
			for(var j=0 ; j<getOutOfMyBox_numbers.length ; j++){
	    		if(getOutOfMyBox_numbers[j]=='') continue ; 
	    		if(theLinks[i].href.match(memberLinkRegex(getOutOfMyBox_numbers[j]))) {
        			theLinks[i].parentNode.parentNode.removeChild(theLinks[i].parentNode) ;
        		}
        	}
		}
	}
	
	theDiv = getId('toolbox_visitors') ;
	if(theDiv!=null){
		var theLis = theDiv.getElementsByTagName('li') ;
		for(var i=0 ; i<theLis.length ; i++){
		  var theLinks = theLis[i].getElementsByTagName('a') ;
			for(var j=0 ; j<theLinks.length ; j++){
			  for(var k=0 ; k<getOutOfMyBox_numbers.length ; k++){
				  if(getOutOfMyBox_numbers[k]=='') continue ; 
					if(theLinks[j].href.match(memberLinkRegex(getOutOfMyBox_numbers[k]))){
					  theLis[i].style.display = 'none' ;
					}
				}
			}
		}
	}
}
function update_getOutOfMyBox(){
  getOutOfMyBox_numbers = retrieve('getOutOfMyBox_numbers', '').split(',') ;
  getOutOfMyBox_names   = retrieve('getOutOfMyBox_names'  , '').split(',') ;
  getModule('getOutOfMyBox').numbers = getOutOfMyBox_numbers ;
  getModule('getOutOfMyBox').names   = getOutOfMyBox_names   ;
}
// Get out of my box!

//==================================================================================================
// Cock Block
//==================================================================================================
function execute_cockBlock(){
  for(var i=0 ; i<links.length ; i++){
    for(var j=0 ; j<cockBlock_numbers.length ; j++){
      if(cockBlock_numbers[j]=='') continue ;
      if(links[i].href.match('^' + regex_bothbox.substring(1,regex_bothbox.length-3) + '/photos/show/(adult|private)/' + cockBlock_numbers[j] + '/([0-9]*)(.*)$')){
        links[i].parentNode.style.display = 'none' ;
      }
    }
  }
}
function update_cockBlock(){
  cockBlock_numbers = retrieve('cockBlock_numbers','').split(',') ;
  cockBlock_names   = retrieve('cockBlock_names'  ,'').split(',') ;
  getModule('cockBlock').numbers = cockBlock_numbers ;
  getModule('cockBlock').names   = cockBlock_names   ;
}
// Cock block

//==================================================================================================
// Choking hazard
//==================================================================================================
function execute_chokingHazard(){
  if(deskbox) return ;
  chokingHazard_numbers = retrieve('chokingHazard_numbers', '20957,3024,13430').split(',') ;
  chokingHazard_names   = retrieve('chokingHazard_names'  , 'DoG,Mal,bryanboy').split(',') ;
  var trollPresent = new Array() ;
	for(var i=0 ; i<chokingHazard_numbers.length ; i++){ trollPresent[i] = false ; }
	if(getId('postings')==null) return ;
	var divLinks = getId('postings').getElementsByTagName('a') ;
	
	for(var i=0 ; i<divLinks.length ; i++){
		if(divLinks[i].className=='profile'){
			for(var j=0 ; j<chokingHazard_numbers.length ; j++){
				if(divLinks[i].href.split('/')[5]==chokingHazard_numbers[j]){
					trollPresent[j] = true ;
					break ;
				}
			}
		}
	}
	var numberOfTrolls = 0 ;
	for(var i=0 ; i<chokingHazard_numbers.length ; i++){ if(trollPresent[i]==true) numberOfTrolls++ ; }
	if(numberOfTrolls>0){
		var warning = 'Warning!  This thread contains traces of:' ;
		for(var i=0 ; i<chokingHazard_numbers.length ; i++){
			 if(trollPresent[i]==true) warning =  warning + ' ' + chokingHazard_names[i] ;
		}
		warning =  warning + '.  User discretion advised.' ;
		var warning_div = create('div') ;
		warning_div.style.backgroundColor = '#ffeeee' ;
		warning_div.style.border          = '1px solid #ffaaaa' ;
		warning_div.style.margin          = '5px' ;
		warning_div.style.padding         = '5px' ;
		warning_div.style.textAlign       = 'center' ;
		warning_div.innerHTML             = warning ;
		getId('postings').insertBefore(warning_div, getId('postings').firstChild) ;
	}
}
function update_chokingHazard(){
  chokingHazard_numbers = retrieve('chokingHazard_numbers', '').split(',') ;
  chokingHazard_names   = retrieve('chokingHazard_names'  , '').split(',') ;
  getModule('chokingHazard').numbers = chokingHazard_numbers ;
  getModule('chokingHazard').names   = chokingHazard_names   ;
}
// Choking Hazard

//==================================================================================================
// Paintbox
//==================================================================================================
function execute_paintBox(){
  if(!deskbox) return ;
  
  paintBox_colors = retrieve('paintBox_colors','#aaffaa,#ffffaa,#aaaaff').split(',') ;
  paintBox_mode   = retrieve('paintBox_mode','1') ;
  
  // Set colors
  var hasTracked = false ;
  var hasMessage = false ;
  var uls = getTags('ul') ;
  for(var i=0 ; i<uls.length ; i++){
    if(uls[i].id=='tracked') hasTracked = true ;
	if(uls[i].id=='inbox')   hasMessage = true ;
  }
  divs[0].style.backgroundColor = '' ;
  var colors = new Array() ;
  var div = getId('deskbox') ;
  if(hasTracked==true  && hasMessage==true)  { div.style.backgroundColor = colors[0] ; body.style.background = paintBox_colors[0] ; }
  if(hasTracked==true  && hasMessage==false) { div.style.backgroundColor = colors[1] ; body.style.background = paintBox_colors[1] ; }
  if(hasTracked==false && hasMessage==true)  { div.style.backgroundColor = colors[2] ; body.style.background = paintBox_colors[2] ; }
  
  // Hide friends
  if(paintBox_mode=='2'){
    var h2s = getTags('h2') ;
    for(var i=0 ; i<h2s.length ; i++){
      if(h2s[i].innerHTML=='friends'){
        h2s[i].style.display = 'none' ;
        break ;
      }
    }
    getId('friends').style.display = 'none' ;
  }  
}
function update_paintBox(){
  paintBox_colors = retrieve('paintBox_colors','').split(',') ;
  paintBox_mode   = retrieve('paintBox_mode'  ,'1').split(',') ;
}
// Paintbox

//==================================================================================================
// Fare dodgers
//==================================================================================================
function execute_fareDodgers(){
  if(deskbox) return ;
  if(!url.match(domain + '/members/invites')) return ;
  var memberId ;
	var content = getId('content') ;
	content.style.lineHeight = '12pt' ;
	var children = content.getElementsByTagName('*') ;
	var invitees = new Array() ;
	var inviters = new Array() ;
	var position = 0 ;
	
	for(var i=0 ; i<children.length ; i++){
		var child = children[i] ;
		if(child.innerHTML.match('You have been invited to the private galleries of the following members:')){
			position = 1 ;
			continue ;
		}
		if(child.innerHTML.match('The following people have been invited to your private gallery:')){
			position = 2 ;
			continue ;
		}
		if(child.tagName=='A'){
			if(child.innerHTML.match('<strike>')) continue ;
			if(position==1) inviters.push(child.href) ;
			if(position==2) invitees.push(child.href) ;
		}
	}
	var theLinks = content.getElementsByTagName('A') ;

	for(var i=1 ; i<theLinks.length-1 ; i++){
		var invitee = false ;
		var inviter = false ;
		for(var j=0 ; j<invitees.length ; j++){
			if(invitees[j]==theLinks[i].href){
				invitee = true ;
				break ;
			}
		}
		for(var j=0 ; j<inviters.length ; j++){
			if(inviters[j]==theLinks[i].href){
				inviter = true ;
				break ;
			}
		}
		var span = create('span') ;
		theLinks[i].style.color = 'black' ;
		theLinks[i].style.padding = '2px' ;
		memberId = theLinks[i].href.split('/')[5] ;
		if(invitee==true && inviter==false){
			theLinks[i].style.backgroundColor = '#ffdddd' ;
			span.innerHTML = '&#9746;' ;
		}
		if(invitee==true && inviter==true){
			theLinks[i].style.backgroundColor = '#ddffdd' ;
			span.innerHTML = '&#9745;' ;
			var link = create('a') ;
			link.innerHTML = ' [PG] ' ;
			link.href = domain + '/photos/folder/' + memberId + '/private' ;
			theLinks[i].parentNode.insertBefore(link, theLinks[i].nextSibling) ;
		}
		if(invitee==false && inviter==true){
			theLinks[i].style.backgroundColor = '#ffffdd' ;
			span.innerHTML = '&#9744;' ;
			var link = create('a') ;
			link.innerHTML = ' [PG] ' ;
			link.href = domain + '/photos/folder/' + memberId + '/private' ;
			theLinks[i].parentNode.insertBefore(link, theLinks[i].nextSibling) ;
		}
		theLinks[i].parentNode.insertBefore(span, theLinks[i]) ;
	}
	
	if(fareDodgers_numbers.length>0){
		var ul = create('ul') ;
		var li ;
		for(var i=0 ; i<fareDodgers_numbers.length ; i++){
			li = create('li') ;
			li.innerHTML = '<a href="/profile/' + fareDodgers_numbers[i] + '">' + fareDodgers_names[i] + '</a>' ;
			ul.appendChild(li) ;
		}
		var h2 = create('h2') ;
		var p  = create('p') ;
		h2.innerHTML = 'Blacklist' ;
		p.innerHTML  = 'The following bastards don\'t deserve invites:' ;
		getId('content').appendChild(h2) ;
		getId('content').appendChild(p) ;
		getId('content').appendChild(ul) ;
	}
}
function update_fareDodgers(){
  fareDodgers_numbers = retrieve('fareDodgers_numbers', '').split(',') ;
  fareDodgers_names   = retrieve('fareDodgers_names'  , '').split(',') ;
  getModule('fareDodgers').numbers = fareDodgers_numbers ;
  getModule('fareDodgers').names   = fareDodgers_names   ;
}
// Fare dodgers

//==================================================================================================
// What's his face?
//==================================================================================================
function execute_whatsHisFace(){
	var link ;
	var memberId ;
	var done = false ;
	for(var i=0 ; i<links.length ; i++){
		if(links[i].innerHTML.match('<img')) continue ;
		if(links[i].className!='profile') continue ;  
		memberId = links[i].href.split('/')[5] ;
		for(var j=whatsHisFace_mode.length-1 ; j>-1 ; j--){
		  link = create('a') ;
		  link.innerHTML = '[' + whatsHisFace_mode.substring(j,j+1) + ']' ;
			switch(whatsHisFace_mode.substring(j,j+1)){
			case 'G': link.href = domain + '/photos/folder/'        + memberId + '/gallery' ; links[i].parentNode.insertBefore(link, links[i].nextSibling) ; break ;
			case 'L': link.href = domain + '/members/activity_log/' + memberId              ; links[i].parentNode.insertBefore(link, links[i].nextSibling) ; break ;
			case 'A': link.href = domain + '/photos/folder/'        + memberId + '/adult'   ; links[i].parentNode.insertBefore(link, links[i].nextSibling) ; break ;
			case 'M':
			  if(ninja_id>0){
			  	link.href = domain + '/messages/reply/' + ninja_id + '?ninja=' + memberId + ',' + links[i].innerHTML.split(':')[0] ;
			  }
			  else{
			    link.href = domain + '/messages/write/' + memberId ;
			  }
			  links[i].parentNode.insertBefore(link, links[i].nextSibling) ;
			  break ;
			default : break ;
		  }
		  
		}
	}
}
function update_whatsHisFace(){ whatsHisFace_mode = retrieve('whatsHisFace_mode', 'GLAM') ; }
// What's his face?

//==================================================================================================
// Kitteh!
//==================================================================================================
function execute_kitteh(){
  if(deskbox) return ;
  if(!url.match('account/welcome')) return ;
  if(url.match(domain+'/account/welcome/greaseBox')) return ;
	var span = create('span') ;
	span.innerHTML = 'kitteh!' ;
	span.className = 'awesome' ;
	span.addEventListener("mouseup", function(){ window.location=domain+'/account/welcome/kittens' ;},false) ;
	getId('content').insertBefore(span, getId('image_promo_list')) ;
	var youtubeIds = [ '0Bmhjf0rKe8' , '7M-jsjLB20Y' , '-1ELq92bakk' , '0vmoZEaN_-o' , 'bZg1kUiKIfI' , '-ER3nou4tuc' , 'hMDhyDFqtz8' , 'oNS6SUe-kGc' , 'Q_udqEp_YR4' , '_ZSbC09qgLI' , '-efQuSlxgWY' , 'owXxuKsZdyE' ] ;
	
	var div = create('div') ;
	div.style.width     =           '425px' ;
	div.style.height    =           '350px' ;
	div.style.margin    =            'auto' ;
	div.style.textAlign =          'center' ;
	div.style.border    = '1px solid black' ;
	
	var index = -1 ;
	if(url.match(domain + '/account/welcome/kittens')){ index = Math.floor(Math.random()*(youtubeIds.length)) ;}
	if(url.match(domain + '/account/welcome/kitten=')){ index = parseInt(url.split('=').parts[1])%youtubeIds.length ;}
	if(index>-1 && index<youtubeIds.length){
		div.innerHTML = '<object width="425" height="350"><param name="movie" value="http://www.youtube.com/v/' + youtubeIds[index] + '"></param><param name="wmode" value="transparent"></param><embed src="http://www.youtube.com/v/' + youtubeIds[index] + '" type="application/x-shockwave-flash" wmode="transparent" width="425" height="350"></embed></object>' ;
		getId('content').insertBefore(div, getId('image_promo_list')) ;
	}
}
// Kitteh!

//==================================================================================================
// Envy
//==================================================================================================
function execute_envy(){
  if(deskbox) return ;
  envy_mode = retrieve('envy_mode', '1') ;
  var string = '' ;
  switch(parseInt(envy_mode)){
    case 1: string = 'cocks'   ; break ;
    case 2: string = 'rabbits' ; break ;
    default : return ;
  }
  var theLinks ;
	var theImgs ;
	var memberId ;
	for(var i=0 ; i<divs.length ; i++){
		if(divs[i].className=='thumb' || divs[i].className=='icon'){
			theImgs = divs[i].getElementsByTagName('img') ;
			if(theImgs[0].parentNode.tagName=='A'){
				theLinks = divs[i].getElementsByTagName('a') ;
				if(theLinks[0].href.match('\/(gallery|adult|private)\/')) continue ;
				memberId = theImgs[0].parentNode.href.split('/')[5] ;
				theImgs[0].src = 'http://www.aidansean.com/greasemonkey/' + string + '/' + (1+memberId%5) + '_60.jpg' ;
			}
		}
	}
	for(var i=0 ; i<imgs.length ; i++){
		if(imgs[i].className=='headshot'){
		  memberId = imgs[i].parentNode.href.split('/')[5]
			if(url.match('account\/welcome')){
				imgs[i].src = 'http://www.aidansean.com/greasemonkey/' + string + '/' + (1+memberId%5) + '_60.jpg' ;
			}
			else{
				imgs[i].src = 'http://www.aidansean.com/greasemonkey/' + string + '/' + (1+memberId%5) + '_30.jpg' ;
			}
		}
	}
}
function update_envy(){ envy_mode = retrieve('envy_mode', '1') ; }
// Envy

//==================================================================================================
// Hot topics
//==================================================================================================
function execute_hotTopics(){
  var thread  = (url.split('/')[4]=='thread') ? url.split('/')[5] : 0 ;
	var threadDiv = 0 ;
 	if(url.split('/')[4]=='thread'){
		for(var i=0 ; i<divs.length ; i++){
			if(divs[i].className=='thread'){
				threadDiv = divs[i] ;
				var div = create('div') ;
				div.id = 'hotTopics' ;
				var span ;
				
				for(var j=0 ; j<hotTopics_titles.length ; j++){
					span = create('span') ;
					span.id = 'hotTopics_' + hotTopics_titles[j].toLowerCase() ;
					span.className  = 'awesome small ' + hotTopics_buttonColors[hotTopics_colors[j]] ;
					span.innerHTML  = hotTopics_titles[j] ;
					span.addEventListener("mouseup", function(e){ hotTopics_set(e) ;},false) ;
					var space = document.createTextNode('\n') ;
					div.appendChild(space) ;
					div.appendChild(span) ;
				}
				span = create('span') ;
				span.id = 'hotTopics_clear' ;
				span.className  = 'awesome small' ;
				span.innerHTML  = 'clear' ;
				span.addEventListener("mouseup", function(e){ hotTopics_set(e) ;},false) ;
				var space = document.createTextNode('\n') ;
				div.appendChild(space) ;
				div.appendChild(span) ;
				threadDiv.insertBefore(div,getId('pagelinks')) ;    
				break ;
			}
		}
	}
	hotTopics_updateLinks() ;
}
function hotTopics_updateLinks(){
  var threads = new Array() ;
  for(var i=0 ; i<hotTopics_titles.length ; i++){
    threads[i] = hotTopics_lists[i].split(',') ;
  }
  var threadDiv = 0 ;
  for(var i=0 ; i<divs.length ; i++){
		if(divs[i].className=='thread'){
			threadDiv = divs[i] ;
			break ;
		}
	}
  for(var i=0 ; i<links.length ; i++){
		for(var j=0 ; j<hotTopics_lists.length ; j++){
			for(var k=0 ; k<threads[j].length ; k++){
				if(
					links[i].href.split('/')[4]=='thread'      && 
					links[i].href.split('/')[5]==threads[j][k] &&
					links[i].className!='prev_page'            &&
					links[i].className!='next_page'            &&
					links[i].rel!='prev start'                 &&
					links[i].rel!='next'                       &&
					links[i].id!='status_popper'               &&
					links[i].id!='open-deskbox'
					){
					links[i].parentNode.style.backgroundColor = hotTopics_displayColors[hotTopics_colors[j]] ;
				}
			}
    }
  }
  var thread  = (url.split('/')[4]=='thread') ? url.split('/')[5] : 0 ;
  if(url.split('/')[4]=='thread'){
    var h2s = threadDiv.getElementsByTagName('h2') ;
    h2s[0].style.backgroundColor = '' ;
    for(var j=0 ; j<hotTopics_lists.length ; j++){
      for(var k=0 ; k<threads[j].length ; k++){
        if(thread==threads[j][k]) h2s[0].style.backgroundColor = hotTopics_displayColors[hotTopics_colors[j]] ;
      }
    }
  }
}
function hotTopics_set(e){
  var thread  = (url.split('/')[4]=='thread') ? url.split('/')[5] : 0 ;
  if(thread==0) return ;
  var oldThreads ;
  var newThreads ;
  for(var i=0 ; i<hotTopics_titles.length ; i++){
  	newThreads = hotTopics_lists[i].split(',') ;
    if(e.target.id=='hotTopics_'+hotTopics_titles[i].toLowerCase()){
  		var add = true ;
  		for(var j=0 ; j<newThreads.length ; j++){
  		  if(newThreads[j]==thread){
					add = false ;
					break ;
    		}
  		}
  		if(add==true) newThreads[newThreads.length] = thread ;
    }
    else{
      oldThreads = hotTopics_lists[i].split(',') ;
  		newThreads = new Array() ;
  		var counter = 0 ;
  		for(var j=0 ; j<oldThreads.length ; j++){
  		  if(oldThreads[j]=='') continue ;
    		if(oldThreads[j]!=thread){
      		newThreads[counter] = oldThreads[j] ;
      		counter++ ;
    		}
  		}
    }
  	hotTopics_lists[i] = newThreads.join(',') ;
  }
  store('hotTopics_lists',hotTopics_lists.join(';')) ;
  hotTopics_updateLinks() ;
}
function update_hotTopics(){
  hotTopics_lists  = retrieve('hotTopics_lists', ';').split(';') ;
  hotTopics_titles = retrieve('hotTopics_titles', 'hot,cold').split(',') ;
  hotTopics_colors = retrieve('hotTopics_colors', '1,3' ).split(',') ;
}
// Hot topics

//==================================================================================================
// First!
//==================================================================================================
function execute_first(){
  for(var i=0 ; i<links.length ; i++){
    var regex = domain + '/forums/thread' ;
    if(links[i].href.match(regex)){
    	links[i].title='Loading... Please hover again...' ;
    	links[i].addEventListener("mouseover", function(e){ first_updateTitle(e) ;},false) ;
    }
  }
}
function first_updateTitle(e){
  var thread = e.target.href.split('/')[5] ;
  var result ;
  var tmpDiv ;
  var theDivs ;
  var theLinks ;
  var objects ;
  var textNode ;
  var ps ;
  var text ;
  var regex ;
  var tags = new Array() ;
  tags[0] = 'strike' ;
  tags[2] = 'sup' ;
  tags[3] = 'sub' ;
  tags[4] = 'a' ;
  tags[1] = 'strong' ;
  tags[5] = 'em' ;
  var AJAXUrl = '' ;
  for(var i=0 ; i<6 ; i++){
    AJAXUrl = AJAXUrl + e.target.href.split('/')[i] + '/' ;
  }
  GM_xmlhttpRequest
  (
    {
      method: "GET",
      url: AJAXUrl,
      onload: function(response){
        var numbers = new Array() ;
        var names = new Array() ;
        for(var i=0 ; i<threadBlock_numbers.length ; i++){
          numbers.push(threadBlock_numbers[i]) ;
          names.push(threadBlock_names[i]) ;
        }
        if(threadBlock_mode==1){
          for(var i=0 ; i<getOutOfMyBox_numbers.length ; i++){
            numbers.push(getOutOfMyBox_numbers[i]) ;
            names.push(getOutOfMyBox_names[i]) ;
          }
        }
  	    result = response.responseText ;
        tmpDiv = create('div') ;
        tmpDiv.innerHTML = result.replace(/<script(.|\s)*?\/script>/g, '') ;
        theDivs = tmpDiv.getElementsByTagName('div') ;
        for(var i=0 ; i<theDivs.length ; i++){
          if(theDivs[i].id=='bmw-1'){
            text = 'Anonymous: ' ;
            theLinks = theDivs[i].getElementsByTagName('a') ;
            for(var j=0 ; j<theLinks.length ; j++){
              regex = domain + '/members/profile/' ;
              if(theLinks[j].href.match(regex)){
                var preventBlock = false ;
                if(isDescendant(get('content'), child)==true && url.match('forums/ignored')) preventBlock = true ;
                if(do_threadBlock=='true' && preventBlock==false){
                  // Hook threadBlock in here
                  for(var k=0 ; k<numbers.length ; k++){
                    if(numbers[k]==user_id) continue ;
                    if(numbers[k]==theLinks[j].href.split('/')[5]){
                      threadBlock_tryBlock(thread) ;
                      e.target.parentNode.style.display = 'none' ;
                    }
                  }
                }
                if(theLinks[j].getElementsByTagName('img').length>0) continue ;
                text = theLinks[j].innerHTML.split(":")[0].replace('<strike>','').replace('</strike>','')  + ': ' ;
                break ;
              }
            }
            ps = theDivs[i].getElementsByTagName('p') ;
            for(var j=0 ; j<ps.length ; j++){
            for(var k=0 ; k<tags.length ; k++){
                theTags = ps[j].getElementsByTagName(tags[k]) ;
                for(var l=theTags.length-1 ; l>-1 ; l--){
                  ps[j].insertBefore(document.createTextNode(theTags[l].innerHTML), theTags[l]) ;
                  ps[j].removeChild(theTags[l]) ;
                }
              }
              objects = ps[j].getElementsByTagName('object') ;
              if(objects.length>0 && do_videoBlock=='true'){
                threadBlock_tryBlock(thread) ;
                break ;
              }
              for(var k=objects.length-1 ; k>-1 ; k--){
                textNode = document.createTextNode(' [VIDEO] ') ;
                ps[j].insertBefore(textNode, objects[k]) ;
                ps[j].removeChild(objects[k]) ;
              }
              text = text + '\r\n\r\n' + ps[j].innerHTML ;
            }
            if(text.length>1000) text = text.substring(0,999) + '...' ;
            e.target.title = text ;
            break ;
          }
        }
      }
    }
  ) ;
}
// First!

//==================================================================================================
// Thread block
//==================================================================================================
function execute_threadBlock(){
  var regex = '^' + domain + '/forums/list(.*)$' ;
  regex = regex.replace(/\//g, '\\\/') ;
  if(url.match(regex)==null) return ;
  var img ;
  var member_id ;
  var theLinks ;
  var link ;
  var thread ;
  var numbers = new Array() ;
  var names = new Array() ;
  for(var i=0 ; i<threadBlock_numbers.length ; i++){
    numbers.push(threadBlock_numbers[i]) ;
    names.push(threadBlock_names[i]) ;
  }
  if(threadBlock_mode==1){
    for(var i=0 ; i<getOutOfMyBox_numbers.length ; i++){
      numbers.push(getOutOfMyBox_numbers[i]) ;
      names.push(getOutOfMyBox_names[i]) ;
    }
  }
  var theDivs = getId('content').getElementsByTagName('div') ;
  for(var i=0 ; i<theDivs.length ; i++){
    if(theDivs[i].className!='summary') continue ;
    theLinks = theDivs[i].getElementsByTagName('a') ;
    for(var j=0 ; j<theLinks.length ; j++){
      if(theLinks[j].className=='profile callout'){
        member_id = theLinks[j].href.split('/')[5] ;
        for(var k=0 ; k<numbers.length ; k++){
          if(member_id==numbers[k]){
            link = theDivs[i].getElementsByTagName('h4')[0].getElementsByTagName('a')[0] ;
            thread = link.href.split('/')[5] ;
            theDivs[i].id = 'div_threadBlock_' + thread ;
            img = create('img') ;
        		img.id = 'img_threadBlock_' + thread ;
        		img.alt = 'Wait' ;
	      		img.src = 'http://img1.thingbox.net/images/ui/wait.gif' ;
        		theDivs[i].appendChild(img) ;
            threadBlock_tryBlock(thread) ;
          }
        }
        break ;
      }
    }
  }
}
function threadBlock_tryBlock(thread){
  var AJAXUrl = domain + '/forums/ignore/' + thread ;
  GM_xmlhttpRequest
  (
	  {
	  	method: "GET",
	  	url: AJAXUrl,
		  onload: function(response){
		    if(getId('img_threadBlock_' + thread)!=null) getId('img_threadBlock_' + thread).style.display = 'none' ;
		    if(getId('div_threadBlock_' + thread)!=null) getId('div_threadBlock_' + thread).style.display = 'none' ;
		  }
	  }
  ) ;
}
function update_threadBlock(){
  threadBlock_numbers = retrieve('threadBlock_numbers','').split(',') ;
  threadBlock_names   = retrieve('threadBlock_names'  ,'').split(',') ;
  getModule('threadBlock').numbers = threadBlock_numbers ;
  getModule('threadBlock').names   = threadBlock_names   ;
  threadBlock_mode = retrieve('threadBlock_mode', '1') ;
}
// Thread block

//==================================================================================================
// Video blocker
//==================================================================================================
function execute_videoBlocker(){
  if(deskbox) return ;
}
// Video blocker

//==================================================================================================
// Fast forward
//==================================================================================================
function execute_fastForward(){
	var spans ;
	var thread ;
	var newLink ;
	var link ;
	var node ;
	var text = '&#8811;' ;
	var m = 0 ;
	var n = 0 ;
	spans = document.getElementById('content').getElementsByTagName('span') ;
	for(var i=0 ; i<spans.length ; i++){
		if(spans[i].className=='count'){
			n++ ;
			node = spans[i] ;
			while(node!=document.getElementsByTagName('body')[0]){
				node = node.parentNode ;
				if(node.className=='text'){
					link = node.getElementsByTagName('a')[0] ;
					thread = link.href.split('/')[5] ;
					n = parseInt(spans[i].innerHTML.split('(')[1].split(' ')[0]) ;
					m = 1+parseInt(n/25) ;
					if((n%25)==0) m = m-1 ;
					newLink = document.createElement('a') ;
					newLink.innerHTML = text ;
					newLink.href = domain + '/forums/thread/' + thread + '/' + (m) +'#' + (n) ;
					newLink.className = 'fastForward' ;
					link.parentNode.appendChild(newLink) ;
					break ;
				}
				if(node.tagName=='LI'){
					link = node.getElementsByTagName('a')[1] ;
					thread = link.href.split('/')[5] ;
					n = parseInt(spans[i].innerHTML) ;
					m = 1+parseInt(n/25) ;
					if((n%25)==0) m = m-1 ;
					newLink = document.createElement('a') ;
					newLink.innerHTML = text ;
					newLink.href = domain + '/forums/thread/' + thread + '/' + (m) +'#' + (n) ;
					newLink.className = 'fastForward' ;
					link.parentNode.insertBefore(newLink,link.nextSibling) ;
					break ;
				}
			}
		}
	}
	spans = document.getElementById('toolbar').getElementsByTagName('span') ;
	for(var i=0 ; i<spans.length ; i++){
		if(spans[i].className=='count'){
			n++ ;
			node = spans[i] ;
			while(node!=document.getElementsByTagName('body')[0]){
  			if(node.parentNode.parentNode.parentNode.parentNode.id=='toolbox_tracked') break ;
				node = node.parentNode ;
				if(node.tagName=='LI'){
					link = node.getElementsByTagName('a')[0] ;
					thread = link.href.split('/')[5] ;
					n = parseInt(spans[i].innerHTML.split('(')[1].split(')')[0]) ;
					m = 1+parseInt(n/25) ;
					if((n%25)==0) m = m-1 ;
					newLink = document.createElement('a') ;
					newLink.innerHTML = text ;
					newLink.href = domain + '/forums/thread/' + thread + '/' + (m) +'#' + (n) ;
					newLink.className = 'fastForward' ;
					link.parentNode.insertBefore(newLink,link.nextSibling) ;
					break ;
				}
			}
		}
	}
}
// Fast forward

//==================================================================================================
// Easy ignore
//==================================================================================================
function execute_easyIgnore(){
  var span ;
  var img ;
  var regex = '^'+domain+'/forums/thread/([0-9]+)$' ;
  regex = regex.replace(/\//g, '\\\/') ;
  for(var i=0 ; i<links.length ; i++){
    if(links[i].className=='fastForward') continue ;
    if(links[i].href.match(regex)){
      span = create('span') ;
      span.innerHTML = ' [ignore] ' ;
      span.id = 'span_ignore_' + links[i].href.split('/')[5] ;
      span.style.cursor = 'pointer' ;
      span.addEventListener("mouseup", function(e){ easyIgnore_ignore(e) ;},false) ;
      img = create('img') ;
      img.id = 'img_ignore_' + links[i].href.split('/')[5] ;
      img.style.display = 'none' ;
      img.alt = 'Wait' ;
	  img.src = 'http://img1.thingbox.net/images/ui/wait.gif' ;
      links[i].parentNode.insertBefore(img,  links[i].nextSibling) ;
      links[i].parentNode.insertBefore(span, links[i].nextSibling) ;
    }
  }
}
function easyIgnore_ignore(e){
  var thread = e.target.id.split('_')[2] ;
  var AJAXUrl = domain + '/forums/ignore/' + thread ;
  getId('img_ignore_'+thread).style.display = '' ;
  GM_xmlhttpRequest
	(
	  {
		  method: "GET",
			url: AJAXUrl,
			onload: function(response){
			getId('img_ignore_'+thread).style.display = 'none' ;
			e.target.parentNode.style.display = 'none' ;
			}
		}
	) ;
}
// Easy ignore

//==================================================================================================
// Ripe to reply
//==================================================================================================
function execute_ripeToReply(){
  var span ;
  var uls ;
  var li ;
  addStyle('.user-text a {color: red; text-decoration:none;} .user-text a:hover {color: red; text-decoration:underline;}  .xreply {float:right}') ;
  if(getId('postings')==null) return ;
  var theDivs = getId('postings').getElementsByTagName('div') ;
  for(var i=0 ; i<theDivs.length ; i++){
    if(theDivs[i].className.match(/posting/)){
			span = create('span') ;
			span.className = 'awesome small black xreply' ;
			span.innerHTML = '&nbsp;reply&nbsp;' ;
			span.addEventListener("mouseup", function(e){ ripeToReply_reply(e) ;},false) ;
			uls = theDivs[i].getElementsByTagName('ul') ;
			if(uls.length>0){
			  li = create('li') ;
			  li.appendChild(span) ;
			  uls[uls.length-1].appendChild(li) ;
			}
			else{
			  span.style.marginRight = '15px' ;
  			theDivs[i].appendChild(span) ;
  	  }
    }
  }
}
function ripeToReply_reply(e){
  var node = e.target ;
  var text ;
  var ps ;
  var div ;
  var tags ;
  var theLinks ;
  while(node.className!='posting'){
    node = node.parentNode ;
    if(node==body) return ;
  }
  ps = node.getElementsByTagName('p') ;
  theLinks = node.getElementsByTagName('a') ;
  if(theLinks.length>0){
  	var username = theLinks[0].innerHTML.split(':')[0] ;
  }
  else{
    username = 'Anonymous #' + node.innerHTML.split('<')[0].split("#")[1].trim() ;
  }
  text = '"' + username + '":' + url.split('#')[0] + '#' + node.parentNode.id + ' said:' ;
  for(var i=0 ; i<ps.length ; i++){
    text = text + '\r\n\r\n' + '_' + ps[i].innerHTML + '_' ;
  }
  div = create('div') ;
  div.innerHTML = text ;
  var stripTags = new Array() ;
  stripTags[0] = 'em' ;
  stripTags[1] = 'strike' ;
  stripTags[2] = 'strong' ;
  stripTags[3] = 'h2' ;
  for(var i=0 ; i<stripTags.length ; i++){
    tags = div.getElementsByTagName(stripTags[i]) ;
    for(var j=tags.length-1 ; j>-1 ; j--){
      div.insertBefore(document.createTextNode(tags[j].innerHTML), tags[j]) ;
      div.removeChild(tags[j]) ;
    }
  }
  theLinks = div.getElementsByTagName('a') ;
  for(var i=theLinks.length-1 ; i>-1 ; i--){
    div.insertBefore(document.createTextNode('"'+theLinks[i].innerHTML+'":'+theLinks[i].href), theLinks[i]) ;
    div.removeChild(theLinks[i]) ;
  }
  text = div.innerHTML ;
  getId('posting_body').value = (getId('posting_body').value=='') ? text : getId('posting_body').value + '\r\n\r\n' + text ;
}
// Ripe to reply

//==================================================================================================
// Friends list
//==================================================================================================
function execute_friendsList(){
  if(deskbox) return ;
	var users = new Array() ;
	var type = 0 ;
	
	if(url.match(domain + '/friends/list/'))   type = 1 ;
	if(url.match(domain + '/groups/members/')) type = 2 ;
	if(url.match(domain + '/events/members/')) type = 3 ;
	if(type==0) return ;
	
	var splitString = '' ;
	if(type==1) splitString = "<div id='friend_list'>" ;
	if(type==2) splitString = '<div class="members">' ;
	if(type==3) splitString = '<div class="members">' ;
	
	var user_id    = url.split('/')[5] ;
	var collection = url.split('/')[5].split('?')[0] ;
	var id = -1 ;
	if(type==1)            id = user_id    ;
	if(type==2 || type==3) id = collection ;
	id = id.split('?')[0] ;
	var nPages = 1 ;
	for(var i=0 ; i<links.length ; i++){
		if(links[i].href.match('page=')){
			if(parseInt(links[i].href.split('=')[1])>nPages) nPages = parseInt(links[i].href.split('=')[1]) ;
		}
	}
	
	// Retrieve users using AJAX
	var pageUrls   = new Array() ;
	var usersLinks = new Array() ;
	var AJAXCounter = 0 ;
	var counter = 0 ;
	for(var i=0 ; i<nPages ; i++){
		if(type==1) pageUrls[i] = domain + '/friends/list/'   + id + '?page=' + (i+1) ;
		if(type==2) pageUrls[i] = domain + '/groups/members/' + id + '?page=' + (i+1) ;
		if(type==3) pageUrls[i] = domain + '/events/members/ '+ id + '?page=' + (i+1) ;
		GM_xmlhttpRequest
		(
			{ 
				method: "GET",
				url: pageUrls[i],
				onload: function(response){
					AJAXCounter++ ;
					var lines = response.responseText.split(splitString)[1].split('<h2>')[0].split('\n') ;
					for(var j=0 ; j<lines.length ; j++){
						if(lines[j].match(/\s*<a href="\/members\/profile\/[0-9]+"\starget="thingbox"\sclass="profile"\stitle="[0-9]+">/)){
							usersLinks[counter] = lines[j] ;
							counter++ ;
						}
					}
					if(AJAXCounter==nPages){
						counter = 0 ;
						for(var j=0 ; j<usersLinks.length ; j++){
							var user_id   = usersLinks[j].split('title="')[1].split('"')[0] ;
							var user_url  = usersLinks[j].split('href="')[1].split('"')[0] ;
							var user_name = usersLinks[j].split('>')[1].split('<')[0] ;
									
							var add_user = true ;
							for(var k=0 ; k<users.length ; k++){
								if(user_id==users[k][0]) add_user = false ;			  
							}
							if(add_user==true){
								users[counter] = new Array() ;
								users[counter][0] = user_id   ;
								users[counter][1] = user_url  ;
								users[counter][2] = user_name ;
								counter++ ;
							}
						}
						users.sort(friendsList_sortByName) ;
						var div = create('div') ;
						var  h3 = create('h3') ;
						var  ul = create('ul') ;
						h3.innerHTML = 'All users listed by username:' ;
						for(var k=0 ; k<users.length ; k++){
							var li = create('li') ;
							li.innerHTML = '<a href="' + users[k][1] + '">' + users[k][2] + '</a>' ;
							ul.appendChild(li) ;
						}
						div.appendChild(h3) ;
						div.appendChild(ul) ;
						getId('content').insertBefore(div, getId('content').firstChild) ;
					}
				}
			}
		) ;
	}
}
function friendsList_sortByName(a, b){
    var x = a[2].toLowerCase() ;
    var y = b[2].toLowerCase() ;
    return ((x < y) ? -1 : ((x > y) ? 1 : 0)) ;
}
// Friends list

//==================================================================================================
// Invite purger
//==================================================================================================
function execute_invitePurger(){
  var theDivs = getId('toolbar').getElementsByTagName('div') ;
  for(var i=0 ; i<theDivs.length ; i++){
    var h2 = theDivs[i].getElementsByTagName('h2')[0] ;
	if(h2==null) continue ;
	if(h2.innerHTML.match('invites')){
	  theDivs[i].id = 'div_invites' ;
	  if(invitePurger_mode==1){
		theDivs[i].style.display = 'none' ;
	  }
	  if(invitePurger_mode==2){
		var li = create('li') ;
		li.innerHTML = '<a style="cursor:pointer;">purge invites</a>' ;
		li.id = 'purger' ;
		li.addEventListener("mouseup", function(e){ invitePurger_purge(e) ;},false) ;
		var ul = theDivs[i].getElementsByTagName('ul')[0] ;
		ul.appendChild(li) ;
		ul.id = 'ul_invites' ;
	  }
	  break ;
	}
  }
}
function invitePurger_purge(e){
  var parts ;
  var string1 = new Array() ;
  var string2 = new Array() ;
  var string3 = new Array() ;
  string1[0] = 'event' ;
  string1[1] = 'group' ;
  string2[0] = 'events\/event\/' ;
  string2[1] = 'groups\/group\/' ;
  string3[0] = '/events/decline_invite/' ;
  string3[1] = '/groups/leave/' ;
  for(var h=0 ; h<2 ; h++){
    var hh = h ;
    var inviteUrl = domain + '/invites?type=' + string1[hh] ;
		GM_xmlhttpRequest
		(
			{ 
				method: "GET",
				url: inviteUrl,
				onload: function(response){
					result = response.responseText ;
					var div1 = document.createElement('div');
					div1.innerHTML = result.replace(/<script(.|\s)*?\/script>/g, '') ;
					var theDivs = div1.getElementsByTagName('div') ;
					for(var i=0 ; i<theDivs.length ; i++){
						if(theDivs[i].id!='content') continue ;
						var theLinks = theDivs[i].getElementsByTagName('a') ;
						for(var j=0 ; j<theLinks.length ; j++){
							if(theLinks[j].href.match(string2[hh])){
								declineUrl = domain + string3[hh] + theLinks[j].href.split('/')[5] ;
								GM_xmlhttpRequest
								(
									{ 
										method: "GET",
										url: declineUrl, 
										onload: function(response){
											invitePurger_decrementInvites(string1[hh]) ;
										}
									}
								)
							}
						}
					}
				}
			}
		) ;
	}
}
function invitePurger_decrementInvites(type){
  var ul = getId('ul_invites') ;
  var lis = ul.getElementsByTagName('li') ;
  var nTotal = 0 ;
  for(var i=0 ; i<lis.length ; i++){
    if(lis[i].innerHTML.split(' ')[1]==type){
      var n = lis[i].innerHTML.split(' ')[0] ;
      if(n==1) lis[i].style.display = 'none' ;
      lis[i].innerHTML = lis[i].innerHTML.split(' ')[0] + (n-1) + lis[i].innerHTML.split(' ')[2] ;
      nTotal = nTotal + n - 1 ;
    }
  }
  if(nTotal==0){
  	getId('div_invites').style.display = 'none' ;
  }
}
// Invite purger

//==================================================================================================
// Mailbox
//==================================================================================================
function execute_mailBox(){
	for(var i=0 ; i<imgs.length ; i++){
		if(imgs[i].className=='logo'){
			imgs[i].src='http://i.dailymail.co.uk/i/sitelogos/logo_mol.gif' ;
			imgs[i].style.backgroundColor='white' ;
			imgs[i].style.padding='2px' ;
			imgs[i].style.border='1px solid black' ;
			imgs[i].style.width='175px' ;
			imgs[i].style.height='33px' ;
			break ;
		}
	}
}
// Mailbox

//==================================================================================================
// Guess who
//==================================================================================================
function execute_guessWho(){
  if(deskbox) return ;
	for(var i=0 ; i<divs.length ; i++) { if(divs[i].className=='thumb')           divs[i].style.display = 'none' ; }
	for(var i=0 ; i<spans.length ; i++){ if(spans[i].className=='headshot_wrap') spans[i].style.display = 'none' ; }
	for(var i=0 ; i<imgs.length ; i++) { if(imgs[i].className=='headshot')        imgs[i].style.display = 'none' ; }
}
// Guess who

//==================================================================================================
// Ninja
//==================================================================================================
function execute_ninja(){
  var ninja_url = domain + '/messages/reply/' + ninja_id ;
  if(url.match(ninja_url)){
    var urlArg = url.split('/')[5].split('\?') ;
		if(urlArg.length==1) return ;
		if(urlArg[1].match('ninja')){
			var ninja_args = urlArg[1].split('=')[1].split(',') ;
			var recipient_id = ninja_args[0] ;
			var recipient_name = ninja_args[1] ;
			var replyUrl = domain + '/messages/reply/' + recipient_id ;
			getId('msg_body').value = '' ;
			getId('msg_subject').value = '' ;
			var h2 = getId('content').getElementsByTagName('h2')[0] ;
			h2.innerHTML = h2.innerHTML.replace(user_name, recipient_name) ;
			getId('send-delete-button').style.display = 'none' ;
			getId('send-button').value = 'send' ;
			getId('messageForm').action = '/messages/reply/' + recipient_id ;
			for(var i=0 ; i<divs.length ; i++){
			  if(divs[i].className=='recipient'){
			    divs[i].style.display = 'none' ;
			    break ;
			  }
			}
		}
  }
}
// Ninja

//==================================================================================================
// Shortcut functions etc
//==================================================================================================
function memberLinkRegex(id){ return '^' + regex_bothbox.substring(1,regex_bothbox.length-3) + '/members/profile/' + id + '$' ; }
function memberGalleryLinkRegex(id){ return '^' + regex_bothbox.substring(1,regex_bothbox.length-3) + '/photos/show/gallery/' + id + '/([0-9]*)$' ; }
function  create(tag){ return document.createElement(tag)        ; } ;
function getTags(tag){ return document.getElementsByTagName(tag) ; } ;
function    getId(id){ return document.getElementById(id)        ; } ;
function add(id,tag,HTML){ var object = create(tag) ; object.innerHTML = HTML ; getId(id).appendChild(object) ;}
function addStyle(source){ var style = create('style') ; style.type = 'text/css' ; style.innerHTML = source ; head.appendChild(style) ; }
function getModule(name){ for(var i=0 ; i<modules.length ; i++){ if(modules[i].name==name) return modules[i] ; } }
function getUserNumber(name){
  var number = -1 ;
  var search = domain+'/members/search_username?q='+name+'&limit=50' ;
}
function isDescendant(parent, child){
  var node = child.parentNode ;
  while (node != null) {
    if(node == parent) return true ;
    node = node.parentNode ;
  }
  return false;
}
