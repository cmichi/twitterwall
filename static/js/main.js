/* where to connect to? */
if (document.location.host === "twitterwall.creal.de")
	var socket = io.connect('http://twitterwall.creal.de');
else
	var socket = io.connect('http://localhost');

var whereToLoadPriorities = [1,1,1, 1,1,1];
whereToLoadPriorities[parseInt(Math.random() * 6)] = 0;

/* let tweets stay for minimum x ms */
var minTime = 4000;

socket.on('connect', function () {
	socket.emit('start', getTerm());
	
	socket.on('cmds', function (data) {
		console.log(data);
		eval(data);
		adjustAll();
	});
	
	socket.on('new_tweet', function (data) {
		console.log(data);
		eval(data);
	});
});
	

function adjustAll() {
	$('.text').textfill({ maxFontPixels: 190, innerTag: 'div' });
}


function adjustId(id) {
	$('#tweet' + id + ' .text').textfill({ maxFontPixels: 190, innerTag: 'div' });
}


/* load the next tweet into the visible area */
function nextTweet(id, text, pic, name) {	
	var currTs = (new Date()).getTime();
	
	var whereToLoad = 0;
	var min = whereToLoadPriorities[0];
	
	/* whereToLoad ist dort wo timestamp am kleinsten ist */
	for (var a = 1; a < 6; a++) {
		/* we have to ensure that the time a tweet lasts is > minTime */
		if (whereToLoadPriorities[a] < min && 
			currTs - whereToLoadPriorities[a] > minTime)
			whereToLoad = a;
	}
	
	$("#tweet" + whereToLoad).css('opacity', 0);
	preload(pic);
	setTweet(whereToLoad, text, pic, name);	
	adjustId(whereToLoad);
	$("#tweet" + whereToLoad).animate({opacity: 1}, 1200);
	
	whereToLoadPriorities[whereToLoad] = (new Date()).getTime();
}


var curr_preload = 0;
function preload(pic) {
	$("#preload" + (curr_preload++ % 5)).attr('src', pic);
}


function setHashtag(tag) {
	$('#hashtag h1').html(tag);
}


function setTweet(id, text, pic, name) {
	name = (name.length < 11) ? name : name.substr(0, 9) + "..";

	var content = '<div class="text" id="tut">\
		<div>'+text+'</div>\
	</div>\
	\
	<div class="info">\
		<img class="author" src="' + pic + '" alt="" align="left" />\
		<span class="name">@' + name + '</span>\
	</div>';
	
	$('#tweet' + id).html(content);
}


function getTerm() {
	var t = (window.location.href).split("?");
	if (t.length >= 1) 
		return t[1];
	else 
		return "";
}


$(window).resize(function() {
	setTimeout("adjustAll()", 1000);
});


