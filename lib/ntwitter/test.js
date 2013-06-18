var twitter = require('./lib/twitter');

var twit = new twitter({
	consumer_key : 'WGpcYX6Jlt087AtDKqxQQ',
	consumer_secret : 'h3Fibjyi4XrmFOqoipK8ok8pzai2VpW8imNLyYSGDc',
	access_token_key : '52725088-t2QTOrYz9vZposLVx0JRJMtRWiuRrpFQwUuPslXUm',
	access_token_secret : 'HF6dGGN07TxMu0yMJlHK8BmSHEjY9JnYOWee3nmw'
});

twit.search('nodejs OR #node', {}, function(err, data) {
  console.log(data);
});
