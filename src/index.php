<?php
$title = 'GreaseMonkey' ;
include($_SERVER['FILE_PREFIX'] . '/_core/preamble.php') ;
?>
  <p>Here are some greasemonkey scripts I wrote.</p>
  <div class="right">
    <h3><a class="title" href="greaseBox.php">noTheater</a></h3>
    <div class="blurb_with_icon">
      <div class="image">
        <a href='notheater.user.js'><img class="icon" src="images/greasemonkey.png" alt="greaseBox" /></a>
      </div>
      <p>Change links to facebook albums so they remove theater mode.</p>
    </div>
  </div>
  
  <p>I wrote a small collection of Greasemonkey scripts for Thingbox.  This is where I store and document them.</p>

  <div class="right">
    <h3><a class="title" href="greaseBox.php">greaseBox</a></h3>
    <div class="blurb_with_icon">
      <div class="image">
        <a href='greaseBox.php'><img class="icon" src="images/greasemonkey.png" alt="greaseBox" /></a>
      </div>
      <p>All the best Greasemonkey scripts in one huge package!</p>
    </div>
  </div>

  <div class="right">
    <h3><a class="title" href="externalisedhomophobia.user.js">externalisedHomophobia</a></h3>
    <div class="blurb_with_icon">
      <div class="image">
        <a href='externalisedhomophobia.user.js'><img class="icon" src="images/greasemonkey.png" alt="externalisedHomophobia" /></a>
      </div>
      <p>This script looks for external links on Thingbox, then adds additional links which will open in new windows.</p>
    </div>
  </div>
    
	<div class="right">
		<h3><a class="title" href="externalisedhomophobia2.user.js">externalisedHomophobia2</a></h3>
		<div class="blurb_with_icon">
			<div class="image">
				<a href='externalisedhomophobia2.user.js'><img class="icon" src="images/greasemonkey.png" alt="externalisedHomophobia2" /></a>
			</div>
			<p>This script looks for external links on Thingbox, then changes them to open in new windows.</p>
		</div>
	</div>

	<div class="right">
		<h3><a class="title" href="imaginator.user.js">imaginator</a></h3>
		<div class="blurb_with_icon">
			<div class="image">
				<a href='imaginator.user.js'><img class="icon" src="images/greasemonkey.png" alt="imaginator" /></a>
			</div>
			<p>This script looks for links to images and then replaces the links with images (including the links).  This script supports <tt>jpg</tt>, <tt>jpeg</tt>, <tt>gif</tt>, and <tt>png</tt>.</p>
		</div>
	</div>
	
	<div class="right">
		<h3><a class="title" href="sfwimaginator.user.js">SFWImaginator</a></h3>
		<div class="blurb_with_icon">
			<div class="image">
				<a href='sfwimaginator.user.js'><img class="icon" src="images/greasemonkey.png" alt="imaginator" /></a>
			</div>
			<p>This script looks for links to images and then replaces the links with images (including the links).  This script supports <tt>jpg</tt>, <tt>jpeg</tt>, <tt>gif</tt>, and <tt>png</tt>.  This script does nothing if it sees the letters "NSFW" or "nsfw" anywhere in the thread.  It is not foolproof.</p>
		</div>
	</div>
	
	<div class="right">
		<h3><a class="title" href="getoutofmybox.user.js">getOutOfMyBox</a></h3>
		<div class="blurb_with_icon">
			<div class="image">
				<a href='getoutofmybox.user.js'><img class="icon" src="images/greasemonkey.png" alt="getoutofmybox" /></a>
			</div>
			<p>This script removes posts and messages posted by specified users.  Change the <tt>toBlock</tt> array to change which users get blocked.  This script will not affect the "new messages" indicator.</p>
		</div>
	</div>
	
	<div class="right">
		<h3><a class="title" href="chokinghazard.user.js">chokingHazard</a></h3>
		<div class="blurb_with_icon">
			<div class="image">
				<a href='chokinghazard.user.js'><img class="icon" src="images/greasemonkey.png" alt="chokinghazard" /></a>
			</div>
			<p>This script looks at the posts on the page, and if it finds any posts by the given users it displays a small public health warning at the top of the thread.</p>
		</div>
	</div>
	
	<div class="right">
		<h3><a class="title" href="hottopics.user.js">hotTopics</a></h3>
		<div class="blurb_with_icon">
			<div class="image">
				<a href='hottopics.user.js'><img class="icon" src="images/greasemonkey.png" alt="hottopics" /></a>
			</div>
			<p>This script allows you to categorise threads using different colours.  By default it comes with two categories, hot and cold (and meh, which means neither), although it is easy to add other categories.  Links to the threads that appear in the sidebars, main page and forum pages appear coloured.  The title at the top of the thread also appears coloured.  Nothing else should be coloured, so please let me know if something odd happens!</p>
		</div>
	</div>
	
	<div class="right">
		<h3><a class="title" href="privatestash.user.js">privateStash</a></h3>
		<div class="blurb_with_icon">
			<div class="image">
				<a href='privatestash.user.js'><img class="icon" src="images/greasemonkey.png" alt="privatestash" /></a>
			</div>
			<p>This script allows you to make a private gallery stash in the same way as you make a normal stash.  It only works for the private gallery.  This is a complicated script and likely to contain bugs, so please let me know if you find any.</p>
		</div>
	</div>
	
	<div class="right">
		<h3><a class="title" href="friendslist.user.js">friendsList</a></h3>
		<div class="blurb_with_icon">
			<div class="image">
				<a href='friendslist.user.js'><img class="icon" src="images/greasemonkey.png" alt="friendslist" /></a>
			</div>
			<p>This script adds a list of friends of a given user to the top of their friends page.  Nothing fancy, just a list of links to friends in alphabetical order.</p>
		</div>
	</div>
	
	<div class="right">
		<h3><a class="title" href="beingakittenscool.user.js">beingAKittensCool</a></h3>
		<div class="blurb_with_icon">
			<div class="image">
				<a href='beingakittenscool.user.js'><img class="icon" src="images/greasemonkey.png" alt="beingakittenscool" /></a>
			</div>
			<p>This script adds replaces that "Being a dickhead's cool" video with a picture of some kittens.</p>
		</div>
	</div>
	
	<div class="right">
		<h3><a class="title" href="faredodgers.user.js">fareDodgers</a></h3>
		<div class="blurb_with_icon">
			<div class="image">
				<a href='faredodgers.user.js'><img class="icon" src="images/greasemonkey.png" alt="faredodgers" /></a>
			</div>
			<p>This script lets you know who has an invite to your private gallery without returning the favour.  The fare dodgers are shown in red, with a big X next to their name!</p>
		</div>
	</div>
	
	<div class="right">
		<h3><a class="title" href="kitteh.user.js">Kitteh!</a></h3>
		<div class="blurb_with_icon">
			<div class="image">
				<a href='kitteh.user.js'><img class="icon" src="images/greasemonkey.png" alt="kitteh" /></a>
			</div>
			<p>Puts a Kitteh on the <a href="http://www.thingbox.com/account/welcome/kittens">front page</a>!  Choose a specific kitteh <a href="http://www.thingbox.com/account/welcome/kitten=4">like this</a>.</p>
		</div>
	</div>
	
	<div class="right">
		<h3><a class="title" href="paintbox.user.js">paintbox</a></h3>
		<div class="blurb_with_icon">
			<div class="image">
				<a href='paintbox.user.js'><img class="icon" src="images/greasemonkey.png" alt="paintbox" /></a>
			</div>
			<p>This script changes the background colours of deskbox.  New messages in your inbox: Blue.  New replies in tracked topics: Yellow.  New messages in your inbox and new replies in tracked topics: Green.</p>
      </ul>
		</div>
	</div>
	
	<div class="right">
		<h3><a class="title" href="christmasiscancelled.user.js">ChristmasIsCancelled</a></h3>
		<div class="blurb_with_icon">
			<div class="image">
				<a href='christmasiscancelled.user.js'><img class="icon" src="images/greasemonkey.png" alt="christmasiscancelled" /></a>
			</div>
			<p>This script changes removes all threads with the words 'christmas', 'xmas' and 'chrimbo' in the title.  The matching is case insensitive and the script ignores <a href="http://www.thingbox.com/forums/thread/232828">this thread</a>.</p>
      </ul>
		</div>
	</div>
	
	<div class="right">
		<h3><a class="title" href="whatshisface.user.js">whatsHisFace</a></h3>
		<div class="blurb_with_icon">
			<div class="image">
				<a href='whatshisface.user.js'><img class="icon" src="images/greasemonkey.png" alt="whatshisface" /></a>
			</div>
			<p>This script adds a link to a member's gallery after the link to their profile name, so you can see who they are without coming across as a maniacal stalker.</p>
      </ul>
		</div>
	</div>
	
	<div class="right">
		<h3><a class="title" href="guesswho.user.js">guessWho</a></h3>
		<div class="blurb_with_icon">
			<div class="image">
				<a href='guesswho.user.js'><img class="icon" src="images/greasemonkey.png" alt="guesswho" /></a>
			</div>
			<p>This script removes profile thumbs, making it a lot harder to keep track of who said what.</p>
      </ul>
		</div>
	</div>
	
	<div class="right">
		<h3><a class="title" href="penisenvy.user.js">penisEnvy</a></h3>
		<div class="blurb_with_icon">
			<div class="image">
				<a href='penisenvy.user.js'><img class="icon" src="images/greasemonkey.png" alt="penisenvy" /></a>
			</div>
			<p>Upon request from one member for more members, this script replaces people's avatars with pictures of penises.  Don't you wish you could replace your friends with more cock?  NSFW</p>
			
			<p>Safe for work version: <a href='bunnyenvy.user.js'>bunnyEnvy</a>.</p>
      </ul>
		</div>
	</div>
	
	<div class="right">
		<h3><a class="title" href="mailbox.user.js">mailBox</a></h3>
		<div class="blurb_with_icon">
			<div class="image">
				<a href='mailbox.user.js'><img class="icon" src="images/greasemonkey.png" alt="mailBox" /></a>
			</div>
			<p>Just for the LULZ.</p>
      </ul>
		</div>
	</div>
	
  <div class="right">
    <h3><a class="title" href="showmeyourprivates.user.js">showmeyourprivates</a></h3>
    <div class="blurb_with_icon">
      <div class="image">
        <a href='showmeyourprivates.user.js'><img class="icon" src="images/greasemonkey.png" alt="showmeyourprivates" /></a>
      </div>
      <p>This script gives you access to anyone's private gallery on thingbox.</p>
    </div>
  </div>
    
<?php foot() ; ?>