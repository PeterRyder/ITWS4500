var express = require('express');
var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server);
var twitter = require('twitter');
var fs = require('fs');
var converter = require('json-2-csv');

app.use(express.static(__dirname + '/views'));

var client = new twitter({
  consumer_key: 'aNTbLgIDxUxsMu6emiXVGjLJv',
  consumer_secret: 'IsgjuwbACim3VVjV3qPaV8MpbbhivHPgBt389rxmE6yAkzJypa',
  access_token_key: '985962829-0UmntaU5SniaOHNpcUmNGle8x4DMa2zqSfDTWUvh',
  access_token_secret: 'gxjBrejy94byl8MEIxNzn8sjEp8KzmFEmic1opHQzZqou'
});

console.log("Listening for tweets from Troy by default");

var nbOpenSockets = 0;

tweetsBuffer = [];
TWEETS_BUFFER_SIZE = 1;

io.sockets.on('connection', function(socket) {
  console.log('Client connected!');

  socket.on('query', function(query) {
    console.log("Client querying for " + query);

    client.stream('statuses/filter', {track: query},  function(stream) {
      /*
        There is a bug in the twitter parser which will break if the twitter
        stream responds with "Exception over data cap". This response is in 
        the form of a string and the twitter module tries to parse this string
        as JSON. There is currently an open issue on GitHub about this.

        If the server errors out with Unexpected token E, and this happens
        after searching for 3 different queries typically, this is that error 
        and there isn't much I can do about it... :(
      */
      stream.on('data', function(tweet) {
        if (tweet.id != null) {
          /* Create message containing required info */
          var msg = {};
          msg.created_at = tweet.created_at;
          msg.id = tweet.id;
          msg.text = tweet.text;
          msg.used_id = tweet.user.id;
          msg.user_name = tweet.user.name;
          msg.user_screen_name = tweet.user.name;
          msg.user_location = tweet.user.location;
          msg.user_followers_count = tweet.user.followers_count;
          msg.user_friends_count = tweet.user.friends_count;
          msg.user_created_at = tweet.user.created_at;
          msg.user_time_zone = tweet.user.time_zone;
          msg.user_profile_background_color = tweet.user.profile_background_color;
          msg.user_profile_image_url = tweet.user.profile_image_url;
          msg.geo = tweet.geo;
          msg.coordinates = tweet.coordinates;
          msg.place = tweet.place;

          /* push msg into buffer */
          tweetsBuffer.push(msg);

          /* send buffer only if full - buffer has been set to only 1 tweet */
          if (tweetsBuffer.length >= TWEETS_BUFFER_SIZE) {
            //broadcast tweets
            socket.emit('tweets', tweetsBuffer);
            tweetsBuffer = [];
          }
        }
        else {
          console.log(tweet);
        }
      });

      
    });

    if (nbOpenSockets <= 0) {
      nbOpenSockets = 0;
      console.log('First active client. Start streaming from Twitter');
      //stream.start();
    }

    nbOpenSockets++;
  });

  socket.on('disconnect', function() {
    console.log('Client disconnected !');
    nbOpenSockets--;

    if (nbOpenSockets <= 0) {
        nbOpenSockets = 0;
        console.log("No active client. Stop streaming from Twitter");
        //stream.close();
    }
  });

  socket.on('output', function(data) {
    if (data.mode == "JSON") {
      fs.exists("json_output.json", function(exists) {
        if (!exists) {
          console.log("File does not exist - will create it");
        }
        
        fs.open("json_output.json", "w", function(error, fd) {
          console.log("Writing data to file");
          fs.write(fd, JSON.stringify(data.tweets, null, 4));
        });
      });      
    }
    else if (data.mode == "CSV") {
      fs.exists("csv_output.csv", function(exists) {
        if (!exists) {
          console.log("File does not exist - will create it");
        }

        fs.open("csv_output.csv", "w", function(error, fd) {
          
          var json2csvCallback = function (err, csv) {
            if (err) throw err;
            fs.write(fd, csv);
          };

          converter.json2csv(data.tweets, json2csvCallback);
        
        });
      });
    }
    else {
      console.log("Unknown file output");
    }
  });
});
