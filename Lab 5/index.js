var html = require('html');
var express = require('express');
var Twitter = require('twitter');
var fs = require('fs');

var file = fs.createWriteStream("output.json");

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/views'));

app.get('/', function (req, res) {
  res.sendFile('index.html');
});

io.on('connection', function (socket) {
  console.log("test");
  var client = new Twitter({
    consumer_key: '9hu0L6XjfvbDjKvXoNVUQekYE',
    consumer_secret: 'EMtgBwSxmkul1yHjPUZ75PTxDUlBAgVtgusoiVDyG0CkurvPVF',
    access_token_key: '985962829-BGOw3Yh4sQNfIybKhnDup53Tg4k8AN3wrwa7mqKB',
    access_token_secret: '0NCCWK2l7WiRBd7IYTmu2KqTx7Hf8Bmf0YTiVOyVOp2dW'
  });

  client.stream('statuses/filter', {track: "test", locations: '-73.68,42.72, -73.67,42.73'},  function(stream) {
    var i = 0;
    stream.on('data', function(tweet) {
      if (i >= 15) {
        console.log("Ending stream");
        stream.destroy();
      }
      try {
        console.log("SERVER: " + tweet.text);
        /* send data to client */
        socket.emit('tweet', tweet.text);
        file.write(tweet);
        console.log(tweet.text);
        i += 1;
      }
      catch(err) {
        //console.log('error');
      }
    });
  });
});

app.listen(3000, function () {
  console.log('Listening on port 3000!');
});