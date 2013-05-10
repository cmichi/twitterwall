/* where to connect to? */
if (document.location.host === "twitterwall.creal.de")
	var socket = io.connect('http://twitterwall.creal.de');
else
	var socket = io.connect('http://localhost');

var whereToLoadPriorities = [1,1,1, 1,1,1];
whereToLoadPriorities[parseInt(Math.random() * 6)] = 0; /* intial random position */

/* let tweets stay for minimum x ms */
var minLastTime = 4000;

var term;

var initiated = true;

socket.on('connect', function () {
	term = setTerm(getUriTerm());
	socket.emit('start', term);
	
	socket.on('new_tweet', function (tweet) {
		console.log(data);
		newTweet(tweet);
	});
});
	

function adjustAll() {
	$('.text').textfill({ maxFontPixels: 190, innerTag: 'div' });
}


function adjustId(id) {
	$('#tweet' + id + ' .text').textfill({ maxFontPixels: 190, innerTag: 'div' });
}


/* load the next tweet into the visible area */
function newTweet(tweet) {	
	var currTs = (new Date()).getTime();
	
	/* determine in which grid position to load the tweet */
	var whereToLoad = 0;
	
	/* whereToLoad is where the timestamp is the lowest (meaning the
	   tweet has been displayed for the longest time) */
	for (var a = 0; a <= whereToLoadPriorities.length; a++) {
		/* we have to ensure that the time a tweet lasts is > minLastTime */
		if (whereToLoadPriorities[a] <= whereToLoadPriorities[whereToLoad])
			whereToLoad = a;
	}
	
	$("#tweet" + whereToLoad).css('opacity', 0);
	preload(pic);
	setTweet(whereToLoad, tweet);	
	adjustId(whereToLoad);
	$("#tweet" + whereToLoad).animate({opacity: 1}, 1200);
	
	whereToLoadPriorities[whereToLoad] = (new Date()).getTime();
	//adjustAll();
}


var curr_preload = 0;
function preload(pic) {
	$("#preload" + (curr_preload++ % 5)).attr('src', pic);
}


function setTerm(new_term) {
	term = new_term;
	$('#term h1').html(new_term);
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


function getUriTerm() {
	var t = (window.location.href).split("?");
	if (t.length >= 1) 
		return t[1];
	else 
		return "";
}


$(window).resize(function() {
	setTimeout("adjustAll()", 1000);
});


$(document).ready(function() {
	$('.fancybox').fancybox();
});
