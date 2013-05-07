# Twitterwall

**Project Status:** The wall works. I am now working on extending the project.


# ToDo

 * initial loading screen. until first tweets are fetched.
 * enable different filtering options (locations, multiple keywords, multiple users)
 * enable option to change display order (random, linear)
 * show images from tweets
 * beware of large json objects from fetched tweets


# Installation

First you should get credentials for accessing the Twitter API.
Those can be obtained via [dev.twitter.com](http://dev.twitter.com) after 
[setting up a new app](https://dev.twitter.com/apps/new).

The easy way:

	$ npm install twitterwall

	# create a file for twitter auth details
	$ cat > config.js
	exports.consumer_key = 'key';
	exports.consumer_secret = 'secret';
	exports.access_token_key = 'key';
	exports.access_token_secret = 'secret';
	^C
	
	$ node server.js

Installing the development version:

	$ git clone https://github.com/cmichi/twitterwall.git
	$ cd twitterwall/

	# create a file for twitter auth details
	$ cat > config.js
	exports.consumer_key = 'key';
	exports.consumer_secret = 'secret';
	exports.access_token_key = 'key';
	exports.access_token_secret = 'secret';
	^C

	# install the necessary dependencies from the package.json
	$ npm install	
	$ node server.js

Then open [http://localhost:3000/](http://localhost:3000).
To stream a specific keyword use [http://localhost:3000/?keyword](http://localhost:3000/?keyword).


# Libraries & Icons

 * express
 * socket.io
 * [ntwitter](https://github.com/AvianFlu/ntwitter)
 * [fancybox](http://fancybox.net/)


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
