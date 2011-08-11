var socket = io.connect('http://localhost:8004');
var whereToLoadPriorities = [1,1,1, 1,1,1];
whereToLoadPriorities[parseInt(Math.random() * 6)] = 0;

/* let it stay for minimum 2500ms */
var minTime = 2500;

socket.on('connect', function () {
	socket.emit('start', getParam("hashtag"));
	
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
	$('.text').textfill({ maxFontPixels: 190, innerTag: 'span' });
}

function adjustId(id) {
	$('#tweet' + id + ' .text').textfill({ maxFontPixels: 190, innerTag: 'span' });
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
	setTweet(whereToLoad, text, pic, name);	
	adjustId(whereToLoad);
	$("#tweet" + whereToLoad).animate({opacity: 1}, 1200);
	
	whereToLoadPriorities[whereToLoad] = (new Date()).getTime();
}

function setHashtag(tag) {
	$('#hashtag h1').html(tag);
}

function setTweet(id, text, pic, name) {
	name = (name.length < 13) ? name : name.substr(0, 11) + "..";
	
	var content = '<div class="text" id="tut">\
		<span>'+text+'</span>\
	</div>\
	\
	<img src="./img/sprechblase.png" alt="" class="sprechblase" />\
	<div class="info">\
	<img class="author" src="' + pic + '" alt="" align="left" />\
	<span class="name">@' + name + '</span>\
	</div>';
	
	$('#tweet' + id).html(content);
}

function getParam(key) {
	key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]" + key + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(window.location.href);
	if(results == null)
		return "";
	else
		return results[1];
}


$(window).resize(function() {
	setTimeout("adjustAll()", 1000);
});
