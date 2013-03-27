var express = require('express');
var io = require('socket.io');
var http = require('http');

var config = require('./config.js');
var ntwitter = require('ntwitter');
var twitter = new ntwitter({
	consumer_key: config.consumer_key
	, consumer_secret: config.consumer_secret
	, access_token_key: config.access_token_key
	, access_token_secret: config.access_token_secret
});

var app = express();
app.use(express.static(__dirname + '/static'));
app.use(express.bodyParser());

var server = require('http').createServer(app);
io = io.listen(server);

server.listen(process.env.PORT || 3000, function() {
	console.log('Listening on port ' + server.address().port);
});


/* hold all sockets within a streams array, according to their term, 
   for efficient handling.  */
var streams = {
	//"cccamp11" : [socket1, socket2, ...]
};


io.sockets.on('connection', function (socket) {
	socket.on('start', function(term){
		if (term == '' || term == undefined || term == null) 
			term = "cccamp11";

		if (streams[term] != undefined && streams[term].length > 0) {
			streams[term].push(socket);
			getInitialTweets(term, socket);
		} else {
			streams[term] = [];
			streams[term].push(socket);

			getInitialTweets(term);
			twitter.stream('statuses/filter', {track: term}, function(stream) {
				stream.on('data', function (tweet) {
					if (tweet == undefined || tweet.user == undefined || 
					    tweet.user.screen_name == undefined)
						return;

					console.log("@" + tweet.user.screen_name + ": " + tweet.text);
					cmds = "nextTweet(0, '" + formatText(term, tweet.text) + 
							"', '" + tweet.user.profile_image_url + 
							"', '" + tweet.user.screen_name + "');";

					for (var i in streams[term]) {
						var s = streams[term][i];
						if (s.disconnected === false) {
							s.emit('new_tweet', cmds);
						} else if (s.disconnected === true) {
							streams[term].pop(s)
						}
					}
				});
			});
		}
	});
});


function getInitialTweets(term, socket) {
	twitter.search(term, {}, function(err, tweets) {
		var cmds = "";
		console.log(tweets);
		console.log(tweets.results.length + " tweets fetched");

		for (var i = 0; i < 6; i++) {
			if (tweets.results[i] == undefined)
				break;

			var tweet = tweets.results[i];

			cmds += "setTweet(" + i + ",'" + 
					formatText(term,
					tweet.text) + 
					"','" +	tweet.profile_image_url 
					+ "','" + 
					tweet.from_user + "'); ";
		}
		cmds += "setHashtag('" + term + "');";

		if (socket) {
			socket.emit('cmds', cmds);
		} else {
			console.log(streams[term].length + " !!")
			for (var i in streams[term]) {
				streams[term][i].emit('cmds', cmds);
			}
		}
	});
}


function formatText(term, text) {
	repl = new RegExp('#' + term, 'gi');
	text = text.replace(repl, "<strong>#" + term + "</strong>");

	repl = new RegExp('@' + term, 'gi');
	text = text.replace(repl, "<strong>#" + term + "</strong>");

	repl = new RegExp(term, 'gi');
	text = text.replace(repl, "<strong>" + term + "</strong>");

	text = text.replace(/"/g, "&quot;");
	text = text.replace(/\n/g, "");

	return text.replace(/'/g, "&rsquo;");
}
