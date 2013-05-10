/* where to connect to? */
if (document.location.host === "twitterwall.creal.de")
	var socket = io.connect('http://twitterwall.creal.de');
else
	var socket = io.connect('http://localhost');

var whereToLoadPriorities = [1,1,1, 1,1,1];
whereToLoadPriorities[parseInt(Math.random() * 6)] = 0; /* intial random position */

/* let tweets stay for minimum x ms */
var minLastTime = 5000;
//var minLastTime = 4000;

var term;
var initiated = false;
var displayed_tweets = [];
var max_tweets = 6;
var standardTerm = "node.js";


socket.on('connect', function () {
	term = getInitialTerm();
	setTerm(term);
	console.log("starting with " + term);
	socket.emit('start', term);
	
	socket.on('new_tweet', function (tweet) {
		console.log(tweet);

		/* are there already enough tweets displayed? */
		if (displayed_tweets.length === max_tweets) {
			pushQueue(tweet);
		} else if (isTweetDisplayed(tweet) === false) {
			newTweet(tweet);
		}

		if (!initiated) {
			$("#loading_box").hide();
		}
	});
});
	

function adjustAll() {
	$('.text').textfill({ maxFontPixels: 190, innerTag: 'div' });
}


function adjustId(id) {
	$('#tweet' + id + ' .text').textfill({ maxFontPixels: 190, innerTag: 'div' });
}


var queue = [];
var max_queue_size = 6;

/* load the next tweet into the visible area.

BUG: the problem here is, that new tweets get loaded __immediately__.
So if you have many many tweets streaming in, this won't work out well. */
function newTweet(tweet) {	
	console.log(tweet);
	var currTs = (new Date()).getTime();
	
	/* determine in which grid position to load the tweet */
	var whereToLoad = 0;
	
	/* whereToLoad is where the timestamp is the lowest (meaning the
	   tweet has been displayed for the longest time) */
	for (var a = 0; a < max_tweets; a++) {
		/* we have to ensure that the time a tweet lasts is > minLastTime */
		if (whereToLoadPriorities[a] <= whereToLoadPriorities[whereToLoad])
			whereToLoad = a;
	}

	$("#tweet" + whereToLoad).css('opacity', 0);
	preload(tweet.pic);
	setTweet(whereToLoad, tweet);	
	adjustId(whereToLoad);
	$("#tweet" + whereToLoad).animate({opacity: 1}, 1200);

	displayed_tweets.push(tweet.id);
	if (displayed_tweets.length > max_tweets)
		displayed_tweets.splice(0,1);
	
	whereToLoadPriorities[whereToLoad] = (new Date()).getTime();
}


function pushQueue(tweet) {
	/* if queue full, simply append the new element to the end 
	if (queue.length > max_queue_size)
		queue.splice(max_queue_size, queue.length);

	queue.push(tweet);
	*/

	/* if queue full, simply omit tweet */
	if (queue.length > max_queue_size) {
		console.log("omitting tweet. queue full.");
		return;
	} else {
		if (isTweetDisplayed(tweet)) return;

		console.log("pushing tweet to queue (size: " + queue.length + ").");
		queue.push(tweet);
	}
}


function isTweetDisplayed(tweet) {
	/* check if tweet is not already displayed */
	for (var i in displayed_tweets) {
		console.log(displayed_tweets[i] + " == " + tweet.id);
		if (displayed_tweets[i] == tweet.id)
			return true;
	}

	return false;
}


function workQueue() {
	console.log("checking queue...");
	/* are there tweets which have already exhausted minLastTime? */
	var now = (new Date()).getTime();

	for (var a = 0; a < max_tweets; a++) {
		var display_time = now - whereToLoadPriorities[a];
		// console.log(display_time)
		if (display_time >= minLastTime && queue.length > 0) {
			if (isTweetDisplayed(queue[0])) 
				continue;

			console.log("taking tweet from queue");
			newTweet(queue.splice(0,1)[0]);
			//return;
		}
	}
	
}
setInterval("workQueue()", minLastTime);


var curr_preload = 0;
function preload(pic) {
	$("#preload" + (curr_preload++ % 5)).attr('src', pic);
}


function setTerm(new_term) {
	term = new_term;
	$('#term h1').html(new_term);
	$('input[name=term]').attr({value: new_term});
}


function setTweet(id, tweet) {
	name = (tweet.name.length < 30) ? tweet.name : tweet.name.substr(0, 30) + "..";

	var content = '<div class="text" id="tut">\
		<div>' + tweet.text + '</div>\
	</div>\
	\
	<div class="info">\
		<img class="author" src="' + tweet.pic + '" alt="" align="left" />\
		<span class="name">@' + tweet.name + '</span>\
	</div>';
	
	$('#tweet' + id).html(content);
}


/* get term param from uri */
function getInitialTerm() {
	var params = parseUri(window.location.href).queryKey;
	if ("term" in params && params.term != undefined)
		return params.term;
	else 
		return standardTerm;
}


$(window).resize(function() {
	setTimeout("adjustAll()", 1000);
});


$(document).ready(function() {
	$('.fancybox').fancybox();
});


