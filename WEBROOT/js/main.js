var socket = io.connect('http://localhost:8004');

socket.on('connect', function () {
	socket.emit('start', getParam("hashtag"));
	
	socket.on('cmds', function (data) {
		eval(data);
		console.log(data);
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

function nextTweet(id, text, pic, name) {	
	for (var i = 5; i > 0; i--) {
		$('#tweet' + i).html(  $('#tweet' + (i-1) ).html()      );	
	}
	
	$("#tweet0").css('opacity', 0);
	setTweet(0, text, pic, name);	
	adjustId(0);
	$("#tweet0").animate({opacity: 1}, 1200);
}

function setTweet(id, text, pic, name) {
	var content = '<div class="text" id="tut">\
		<span>'+text+'</span>\
	</div>\
	\
	<div class="info"><img src="./img/sprechblase.png" alt="" class="sprechblase" />\
	<div class="author">\
		<img src="' + pic + '" alt="" align="left" />\
		<span class="name">@' + name + '</span>\
	</div></div>';
	
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
