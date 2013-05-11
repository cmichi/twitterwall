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
/* using e.g. an older version of nginx without support for ws.
use this env variable then! otherwise the user will face long loading
times, until the browser gets that no ws are available. */
if (process.env.NO_WS_SUPPORT == 1) {
	console.log("no websocket support available  mode");
	io.set("transports", ["xhr-polling"]);
	io.set("polling duration", 10);
}
io.set("close timeout", 20);

server.listen(process.env.PORT || 3000, function() {
	console.log('Listening on port ' + server.address().port);
});

var max_tweets = 6;
var queue_size = 6;
var minLastTime = 5000;

/* hold all sockets within a streams array, according to their term, 
   for efficient handling.  */
var streams = {
	//"searchterm" : [socket1, socket2, ...]
};


/* hold the last max_tweets pushed tweets in this object, so that they
can be send as initial tweets for new client. so they don't
show a plain website */
var initial_tweets = {
	//"searchterm" : [{..}, {..}, ...]
}


io.sockets.on('connection', function (socket) {
	socket.on('start', function(term){
		socket.tweetsSendInThisSlot = 0;
		if (term == '' || term == undefined || term == null) 
			term = "node.js";

		if (streams[term] != undefined && streams[term].length > 0) {
			console.log("new client tuning in for " + term);
			streams[term].push(socket);
			sendInitialTweets(term, socket);
		} else {
			console.log("creating new stream for " + term);
			streams[term] = [];
			initial_tweets[term] = [];
			streams[term].push(socket);

			sendInitialTweets(term, socket);
			twitter.stream('statuses/filter', {track: term}, function(stream) {
				stream.on('data', function (tweet) {
					if (tweet == undefined || tweet.user == undefined || 
					    tweet.user.screen_name == undefined)
						return;

					//console.log("@" + tweet.user.screen_name + ": " + tweet.text);
					var next_tweet = {
						id: tweet.id,
						text: formatText(term, tweet.text),
						pic: tweet.user.profile_image_url,
						name: tweet.user.screen_name 
					};

					if (streams[term].length === 0) {
						/* no more clients are listening */
						console.log("destroying stream " + term);
						stream.destroy();
						delete initial_tweets[term];
						return;
					}
					
					console.log("New tweet coming in for " + streams[term].length + " clients for " + term);
					for (var i in streams[term]) {
						var s = streams[term][i];
						if (s.disconnected === false) {
							/* are we having way too many tweets streamed? 
							this is the case for heavily trending topics.
							it does not make sense to send them all to the 
							client. some have to be ommitted. */
							if (s.tweetsSendInThisSlot > max_tweets + queue_size) {
								console.log("slot already exhausted. omitting tweet for client.");
								continue;
							}

							console.log("pushing new tweet to client for " + term);
							s.emit('new_tweet', next_tweet);
							s.tweetsSendInThisSlot++;
							addToInitialTweets(term, next_tweet);
						} else if (s.disconnected === true) {
							console.log("one user disconnected from " + term);
							streams[term].splice(i, i+1);
						}
					}
				});
			});
		}
	});
});


var newSlot = function() {
	for (var term in streams) {
		for (var j in streams[term]) {
			streams[term][j].tweetsSendInThisSlot = 0;
		}
	}
}
setInterval(newSlot, minLastTime);


function addToInitialTweets(term, tweet) {
	initial_tweets[term].unshift(tweet);

	/* delete the rest */
	if (initial_tweets[term].length > max_tweets)
		initial_tweets[term].splice(max_tweets, initial_tweets[term].length);
}


/* possibly optimise this by buffering the tweets from a stream.
when clients are already "listening" for tweets about such a term
this is possible. */
function getInitialTweets(term, socket) {
	twitter.search(term, {}, function(err, tweets) {
		var cmds = "";
		//console.log(tweets);
		console.log(tweets.results.length + " initial tweets fetched");

		for (var i = 0; i < max_tweets; i++) {
			if (tweets.results[i] == undefined)
				break;

			var tweet = tweets.results[i];
			//console.log(tweet)
			var next_tweet = {
				id: tweet.id,
				text: formatText(term, tweet.text),
				pic: tweet.profile_image_url,
				name: tweet.from_user
			};

			if (socket) {
				addToInitialTweets(term, next_tweet);
				socket.emit('new_tweet', next_tweet);
				socket.tweetsSendInThisSlot++;
			} 
		}
	});
}


function sendInitialTweets(term, socket) {
	if (term in initial_tweets && initial_tweets[term].length > 0) {
		for (var i in initial_tweets[term])
			socket.emit('new_tweet', initial_tweets[term][i]);
			socket.tweetsSendInThisSlot++;
		
	} else {
		getInitialTweets(term, socket);
	}
}


function longer(words, count) {
	for (var i in words) {
		if (words[i].length > count) {
			return true;
		}
	}

	return false;
}


function formatText(term, text) {
	/* is there any word longer than 40 chars? split it for better text displaying! */
	var count = 25;
	var words = text.split(" ");
	for (var i in words) {
		if (words[i].length > count) {
			var consume = words[i];
			var produced = ""
			while (consume.length > count) {
				produced += consume.substr(0,count) + " ";
				consume = consume.substr(count);
			}
			produced += consume;
			text = text.replace(words[i], produced.trim());
		}
	}

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
