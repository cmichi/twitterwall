# Readme

This project aims on providing a pure HTML/CSS/JavaScript Twitterwall.

New tweets are automatically displayed on the wall.

Once the page has been loaded a constant connection to the server is kept (using socket.io). 

The client gets noticed on new tweets and displays them on the wall.


# Project status

Works! But still more of a prototype, some work still has to be done to make it a proper project :)


# Eye Candy

![Screenshot](https://github.com/cmichi/twitterwall/raw/master/images/thumb.png)


# Installation

	npm install policyfile

	git clone --recursive https://github.com/cmichi/twitterwall.git
	cd twitterwall
	echo "exports.user = 'USER'; exports.pw = 'PW';" > twitter_account.js
	
	# start it
	node server.js
		
	# open http://localhost:8004/?hashtag=YOUR_TAG


# Known issues

If you encounter any problems and use Firefox be sure
that on your `about:config` page `network.websocket.override-security-block`
is set to `true`.

