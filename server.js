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

io.sockets.on('connection', function (socket) {
	//listenForNewTweets(socket);
	socket.on('start', function(term){
		if (term == '' || term == undefined || term == null) 
			term = "cccamp11";

		getInitialTweets(term, socket);
		twitter.stream('statuses/filter', {track: term}, function(stream) {
			stream.on('data', function (tweet) {
				if (tweet == undefined || tweet.user == undefined || 
				    tweet.user.screen_name == undefined)
					return;

				console.log("@" + tweet.user.screen_name + ": " + tweet.text);
				cmds = "nextTweet(0, '" + formatText(term, tweet.text) + 
						"', '" + tweet.user.profile_image_url + 
						"', '" + tweet.user.screen_name + "');";
				//console.log("\n\n")
				socket.emit('new_tweet', cmds);
			});
		});
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
		socket.emit('cmds', cmds);
	});
}


function setHashtag(tag) {
	$("h1").html(tag);
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
