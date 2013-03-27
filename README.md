# Twitterwall

**Project Status:** Working on a complete rewrite. Project has not
been modified since two years.


# ToDo


# Installation

	$ git clone https://github.com/cmichi/twitterwall.git
	$ cd twitterwall/

	# create a file for twitter auth details
	$ touch twitter_account.js
	$ vi twitter_account.js
	exports.user = 'USER'; 
	exports.pw = 'PW';

	# install the necessary dependencies from the package.json
	$ npm install	
	$ node server.js

Then open [http://localhost:3000/](http://localhost:3000).


# Libraries & Icons

 * express
 * socket.io


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
