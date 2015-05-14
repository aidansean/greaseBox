<?php
$title = 'greaseBox' ;
include($_SERVER['FILE_PREFIX'] . '/_core/preamble.php') ;
?>
<p>AidanSean labs has been hard at work (heh) to bring you all his scripts in one script!</p>
  
  <div class="right">
    <h3>Download greaseBox!</h3>
    <div class="blurb_with_icon">
      <div class="image">
        <a href="greasebox.user.js"><img class="icon" src="images/greasemonkey.png" alt="Download greaseBox!" /></a>
      </div>
      <p>Get <a href="greasebox.user.js">greaseBox</a> now!</p>
      <p>Version 1.0 (beta) 2011-02-05</p>
      <p>greaseBox currently includes:</p>
      <dl id="greaseBox_help">
        <dt>ThingBlocked</dt>
        <dd>This module blocks all of Thingbox so you can't read or post anything.  If this module was enabled you wouldn't be able to read this page!</dd>
        
        <dt>greaseBox settings</dt>
        <dd>This module shows the greaseBox settings page.</dd>
        
        <dt>greaseBox help</dt>
        <dd>This module shows this page!</dd>
        
        <dt>Link fixer</dt>
        <dd><span>This module converts <a class="smarterwiki-linkify" href="http://www.thingbox.com">www.thingbox.com</a> and <a class="smarterwiki-linkify" href="http://www.myofficebox.com">www.myofficebox.com</a> links to the correct domain.  Turns broken links into working links.</span></dd>
        
        <dt>Border maker</dt>
        <dd>This module adds borders to most images.</dd>
        
        <dt>Being a kitteh's cool!</dt>
        <dd>This module replaces that godawful Being a Dickhead's Cool video with a <a href="http://1.bp.blogspot.com/_EXopv5BJbnY/Sw3iHTqsjgI/AAAAAAAACuc/wbLR22BdNOY/s1600/cute-kitten-9.jpg" rel="external" target="_blank">picture of some kittens</a>.</dd>
        
        <dt>Links to images</dt>
        <dd>For all links to externals images this module adds the image to the end of a post.  You can choose to have the safe for work version. (This disables the module if the letters "NSFW" are found anywhere on the page.  The search for these letters is canse insenstiive.)</dd>
        
        <dt>External links</dt>
        <dd>This module edits external links.  When the mode is set to 1 it adds new links that open in a new window.  When the mode is set to 2 it changes existing links, forcing them to open in a new window.</dd>
        
        <dt>Block users</dt>
        <dd>This module removes posts and messages from certain users.  Edit the source code to add/remove users from the list.</dd>
        
        <dt>Cock blocker</dt>
        <dd>This module removes links to adult and private galleries of certain users.  Edit the source code to add/remove users from the list.</dd>
        
        <dt>Warning label</dt>
        <dd>Adds pointless nanny-state style warnings to the top of threads when certain users post.  Edit the source code to add/remove users from the list.</dd>
        
        <dt>Deskbox colours</dt>
        <dd>This module changes the background colour of deskbox depending on whether you have new messages or posts in tracked topics.</dd>
        
        <dt>Private gallery invite manager</dt>
        <dd>This module keeps track of who has reciprocated private gallery invites, and adds links to the private galleries of the other members.</dd>
        
        <dt>Links to galleries, logs</dt>
        <dd>This module adds links to members galleries, activity logs, adult galleries and message pages.  Edit which links are shown, and in what order by editing the source code.</dd>
        
        <dt>Cute kitten overload</dt>
        <dd>This module adds videos of cute kittens to the welcome page.  View a random kitteh at <a href="http://www.thingbox.com/account/welcome/kittens">this page</a> and a specific kitteh at <a href="http://www.thingbox.com/account/welcome/kitten=1">this page</a>.</dd>
        
        <dt>Avatar replacer</dt>
        <dd>This module replaces usersa avatars with other images:</dd>
        <dd>penisEnvy: replace with penises!</dd>
        <dd>bunnyEnvy: replace with bunnies!</dd>
        
        <dt>Thread categoriser</dt>
        <dd>This module lets you keep track of different threads by giving them different (colour coded) categories.  You can change the categories and colours by editing the source code.</dd>
        
        <dt>Ripe to Reply</dt>
        <dd>This module makes it easier to quote other posts. It should replicate the behaviour of ripeToReply.</dd>
        
        <dt>User lists</dt>
        <dd>This module gives a simple list of friends when you visit the friends page of a user's profile.  It also works for group and event pages.</dd>
        
        <dt>New logo for the box</dt>
        <dd>This module swaps the Thingbox logo for something else.  Just for the LULZ.</dd>
        
        <dt>Avatar remover</dt>
        <dd>This module removes avatars, for no adequately explored reason.</dd></dl>
    </div>
  </div>

  <div class="right">
    <h3>Why use greaseBox?</h3>
    <div class="blurb_with_icon">
      <div class="image">
        <img class="icon" src="images/greasemonkey.png" alt="greaseBox" />
      </div>
      <p>greaseBox is a collection of Greasemonkey macros designed to make your Thingbox experience even better!  More useful, more colourful, more trollful, more everything you could want!</p>
      
      <p>Combining scripts has several advantages:</p>
      <dl>
        <dt>Faster</dt>
        <dd>By executing a single script instead of several, your browser will save you time!</dd>
        
        <dt>Lighter</dt>
        <dd>The same variables can be reused by several or all macros, saving valuable memory.</dd>
        
        <dt>Easier</dt>
        <dd>Instead of installing and downloading all macros separately, just do it once!  Easier for everyone!</dd>
        
        <dt>Cleaner</dt>
        <dd>Whenever several macros are used there is always the potential for unexpected results.  Having a consistent framework substantially reduces how often this happens.</dd>
        
        <dt>Smarter</dt>
        <dd>Executing the macros in the right order and making them aware of each other's work is vital to getting good results.  greaseBox will get it right every time!</dd>
        
        <dt>Tidier</dt>
        <dd>Having one script instead of several takes up fewer pixels in your browser settings screen!</dd>
        
        <dt>Friendlier</dt>
        <dd>Providing a framework for macros makes it much easier for future development and new innovations.</dd>
        
        <dt>Mightier</dt>
        <dd>Combining macros leads to more possibilities than ever before!  Fusing macros creates even more powerful macros.</dd>
        
        <dt>Cheaper</dt>
        <dd>With fewer requests sent to the server, Thingbox will have a lower workload and use less bandwith.</dd>
        
        <dt>Fresher</dt>
        <dd>When one macro gets updated, they can all be updated.  Even the oldest macros will get updated every now and then.</dd>
      </dl>
    </div>
  </div>
    
<?php foot() ; ?>