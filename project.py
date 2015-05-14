from project_module import project_object, image_object, link_object, challenge_object

p = project_object('greasebox', 'greaseBox')
p.domain = 'http://www.aidansean.com/'
p.path = 'greasebox'
p.preview_image_ = image_object('http://placekitten.com.s3.amazonaws.com/homepage-samples/408/287.jpg', 408, 287)
p.folder_name = 'greasemonkey'
p.github_repo_name = 'greaseBox'
p.mathjax = False
p.links.append(link_object('http://www.thingbox.com/', '', 'Thingbox'))
p.links.append(link_object(p.domain, 'greasemonkey/greaseBox.php', 'Live page'))
p.introduction = 'In the mid to late 2000s I used to visit an LGBT social networking site, <a href="http:///www.thingbox.com">Thingbox</a>.  The site had many features, but the users wanted more.  It was around this time that I was discovering how to use greasemonkey, so I put together many short scripts.  Eventually I combined them all into a single script called greasebox that was very popular.  It has been many years since it was maintained though, so I doubt it still fully works.'
p.overview = '''The website provides a huge amount of information via AJAX and HTTP requests, and this project required some clever reverse engineering to get right.  When the scripts are combined they are modular, and they are executed in a specific order to prevent clashes.  A few modules are inter dependent, so they are arranged in the correct order, otherwise it goes from least to most fragile.  There is also a debug tool to see exactly whre things go wrong.  There is also a detailed interface page where users can change their settings.

Unfortunately I don't have a screenshot of the project, since it was developed so long ago (last touched 2011/02/05) and in browser scripting has changed a lot since then.'''

p.challenges.append(challenge_object('This had to use the Thingbox "API" properly.', 'Although Thingbox didn\'t have an official API, I reverse engineered how things worked to make it do what I wanted.  This occasionally required help from other users (eg to send friend requests) but was mostly possible on my own.', 'Resolved.'))

p.challenges.append(challenge_object('The content had to be intuitive and responsive to users\'s needs.', 'This was one of the first projects where I had to see things from the point of view of the user and make things as intuitive as possible.  The aesthetics of the project had to fit in with the Thingbox style, not only to look good, but to be usable.  This meant that I had to deconstruct and understand the rationale behind the site design and the choices the creators made, which was very informative.  I also had to pay close attention to requests and questions from users as they arose, which gave me a lot of insight into how to make things as easy to use as possible.', 'Resolved.'))

p.challenges.append(challenge_object('When combining modules the order mattered.', 'I had several modules that would go through and edit the content of the page.  Obviously this would cause problems if it wasn\'t done carefully, so I had to order the modules in the correct way.  This was not trivial to do, but made management much simpler.  There was also a dedicated debug module that would take information from the current session and print it to a <tt>div</tt> element that the user could attach to the page with a special command.  This debug information allowed me to determine exactly how far the scripts got before a module caused a problem.', 'Resolved.'))

p.challenges.append(challenge_object('This project suffered from a sense of humour.', 'I was writing for a groupof mostly well educated middle aged gay men, and as a result there was a lot of banter and humour.  I would create puns for each of the single modules.  (For example one of the running jokes was constant references to internalised homophobia, so I called the script that open external links in a new window "externalised homophobia".)  This did not help when I tried to combine the modules into a single script, and I will not be making that mistake again!', 'Resolved.'))

p.challenges.append(challenge_object('This needed cross platform and cross browser support.', 'This was probably the most difficult challenge to overcome.  I would test in Firefox with a mac, but there were many users who insisted on using Window, Chrome, and sometimes even Safari.  Each one had different nuances (including counter intuitive storage of information) that had to be understood to make features work.  Although I tried very hard to make it work, there were some features that didn\'t make it onto every browser', 'Mostly resolved'))