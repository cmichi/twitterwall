# Twitterwall

This is a very basic twitterwall. The project takes use of the Twitter
Streaming API to show new tweets in soft realtime.

A public instance is available via [http://twitterwall.creal.de](http://twitterwall.creal.de).

## How it looks

![Twitterwall](https://github.com/cmichi/twitterwall/raw/master/screenshot.jpg)


# ToDo

 * enable different filtering options (follow users, locations)
 * show images from tweets. Idea: do this by showing the tweet twice as long and alternating between text and image.


# Installation

First you should get credentials for accessing the Twitter API.
Those can be obtained via [dev.twitter.com](http://dev.twitter.com) after 
[setting up a new app](https://dev.twitter.com/apps/new).

Installing the development version:

	git clone https://github.com/cmichi/twitterwall.git
	cd twitterwall/
	npm install

	# create a file containing the twitter auth details
	cat > config.js
	exports.consumer_key = 'key';
	exports.consumer_secret = 'secret';
	exports.access_token_key = 'key';
	exports.access_token_secret = 'secret';
	^C
	
	cd lib/ntwitter/
	npm install
	cd ../../

	# does your webserver support websockets? if not:
	# export NO_WS_SUPPORT=1

	node server.js

Then open [http://localhost:3000/](http://localhost:3000).
To stream a specific keyword use [http://localhost:3000/?term=keyword](http://localhost:3000/?term=keyword).


# Libraries & Icons

 * express
 * socket.io
 * [ntwitter](https://github.com/AvianFlu/ntwitter)
 * [fancybox](http://fancybox.net/)
 * [parseUri](http://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js)
 * [jquery-textfill](https://github.com/jquery-textfill/jquery-textfill)


# License

	Copyright (c) 2013

		Michael Mueller <http://micha.elmueller.net/>

	Permission is hereby granted, free of charge, to any person obtaining
	a copy of this software and associated documentation files (the
	"Software"), to deal in the Software without restriction, including
	without limitation the rights to use, copy, modify, merge, publish,
	distribute, sublicense, and/or sell copies of the Software, and to
	permit persons to whom the Software is furnished to do so, subject to
	the following conditions:

	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
	LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
	OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
