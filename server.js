var express = require('express');
var io = require('socket.io');
var http = require('http');

var config = require('./config.js');
var ntwitter = require('ntwitter');
var twitter = new ntwitter({
	consumer_key: config.consumer_key
	, consumer_secret: config.consumer_secret
	, access_token_key: config.access_token_key
	, access_token_secret: access_token_secret
});

var tcredentials = require('./tcredentials.js');
var twitter = require('ntwitter');
var twit = new twitter(credentials.data);
var term = "cccamp11";

twitter.stream('statuses/filter', {track: term}, function(stream) {
	stream.on('data', function (data) {
		console.log(data);
	});
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
	//if (url_term != '') 
		//term = url_term;

	getInitialTweets(socket);
	listenForNewTweets(socket);
});


function getInitialTweets(socket) {
		var bodyarr = [];
		options.path = options.orig_path + term.replace(/#/g, '%23');
		http.get(options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
				bodyarr.push(chunk)
				})
			res.on('end', function() {
				var data = bodyarr.join('')
				var cmds = "";
				var tweets = eval("(" + data + ")");
				console.log(tweets);
				console.log(tweets.results.length + " tweets fetched");

				if (tweets.results.length >= 6) {
					for (var i = 0; i < 6; i++) {
						var tweet = tweets.results[i];

						cmds += "setTweet(" + i + ",'" + 
								formatText(tweet.text) + 
								"','" +	tweet.profile_image_url 
								+ "','" + 
								tweet.from_user + "'); ";
					}
				}
				cmds += "setHashtag('" + term + "');";
				socket.emit('cmds', cmds);
			})
		})
}

function setHashtag(tag) {
	$("h1").html(tag);
}


function formatText(text) {
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


function listenForNewTweets(socket) {
	var twit = new TwitterNode({
				user: twitter_account.user,
				password: twitter_account.pw,
				track: [term],
		});

		twit.addListener('error', function(error) {
				console.log(error.message);
		})

		.addListener('tweet', function(tweet) {
				console.log("@" + tweet.user.screen_name + ": " + 
					tweet.text);
				cmds = "nextTweet(0, '" + formatText(tweet.text) + 
						"', '" + tweet.user.profile_image_url + 
						"', '" + tweet.user.screen_name + "');";
				socket.emit('new_tweet', cmds);
		})

		.addListener('limit', function(limit) {
				console.log("LIMIT: " + sys.inspect(limit));
		})

		.addListener('delete', function(del) {
				console.log("DELETE: " + sys.inspect(del));
		})

		.addListener('end', function(resp) {
				console.log("end of connection: " + resp.statusCode);
		})


		.stream();
}

