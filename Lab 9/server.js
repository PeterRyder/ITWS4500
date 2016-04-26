var express = require('express');
var app = express();
var server = app.listen(3000);
var io = require('socket.io').listen(server);
var twitter = require('twitter');
var fs = require('fs');
var converter = require('json-2-csv');
var mongoose = require('mongoose');

app.use(express.static(__dirname + '/views'));

/* create the twitter client */
var client = new twitter({
  consumer_key: 'aNTbLgIDxUxsMu6emiXVGjLJv',
  consumer_secret: 'IsgjuwbACim3VVjV3qPaV8MpbbhivHPgBt389rxmE6yAkzJypa',
  access_token_key: '985962829-0UmntaU5SniaOHNpcUmNGle8x4DMa2zqSfDTWUvh',
  access_token_secret: 'gxjBrejy94byl8MEIxNzn8sjEp8KzmFEmic1opHQzZqou'
});

/* connection to database */
mongoose.connect('mongodb://localhost/Lab7');

/* get the schema */
var Schema = mongoose.Schema;

/* document model for tweets in the database */
var Tweet = new Schema ({
  created_at: Date,
  id: String,
  text: String,
  user_id: String,
  user_name: String,
  user_scren_name: String,
  user_location: String,
  user_followers_count: Number,
  user_friends_count: Number,
  user_created_at: Date,
  user_time_zone: String,
  user_profile_background_color: String,
  user_profile_image_url: String,
  geo: String,
  coordinates: String,
  place: String
});

mongoose.model('Tweet', Tweet)

/* get the tweets model */
var TweetModel = mongoose.model('Tweet');

/* keep track of open socket connections */
var nbOpenSockets = 0;

/* the tweet buffer */
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
        after searching for 3 different queries typically. I have created a
        hotfix which I mention in the README file.
      */
      stream.on('data', function(tweet) {
        if (tweet.id != null) {
          /* Create message containing required info */
          var msg = {};
          msg.created_at = tweet.created_at;
          msg.id = tweet.id;
          msg.text = tweet.text;
          msg.user_id = tweet.user.id;
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
            /* broadcast tweets */
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

  socket.on('build', function(data) {
    console.log("Rebuilding Database");

    /* rebuild the database every time user wants to store tweets */
    TweetModel.remove({}, function(err, removed) {
      console.log("Removed " + removed + " tweets while rebuilding database");
      if (err) console.log(err);
    });

    for (var i = 0; i < data.length; i++) {
      /* ensures nulls are not stored in database will store empty strings instead */
      var geo_insert = null;
      var place_insert = null;

      geo_insert = data[i].geo;
      if (geo_insert == null) {
        geo_insert = "";
      }

      place_insert = data[i].place;
      if (place_insert == null) {
        place_insert = "";
      }

      /* store the tweet in the database */
      var tweet = new TweetModel({
        created_at: data[i].created_at,
        id: data[i].id,
        text: data[i].text,
        user_id: data[i].user_id,
        user_name: data[i].user_name,
        user_scren_name: data[i].user_scren_name,
        user_location: data[i].user_location,
        user_followers_count: data[i].user_followers_count,
        user_friends_count: data[i].user_friends_count,
        user_created_at: data[i].user_created_at,
        user_time_zone: data[i].user_time_zone,
        user_profile_background_color: data[i].user_profile_background_color,
        user_profile_image_url: data[i].user_profile_image_url,
        geo: data[i].geo_insert,
        coordinates: data[i].coordinates,
        place: data[i].place_insert
      });

      /* save the database */
      tweet.save(function(err) {
        if (err) console.log(err);
      });

    }
  });

  socket.on('output', function(data) {
    TweetModel.find(function (err, tweets) {
      if(err) console.log(err);

      /* check the output file mode */
      if (data.mode == "JSON") {

        /* check if the file exists */
        fs.exists("json_output.json", function(exists) {
          if (!exists) {
            console.log("File does not exist - will create it");
          }

          else {
            console.log("File exists - will overwrite file");
          }
          
          /* open the file for writing */
          fs.open(data.filename + ".json", "w", function(error, fd) {
            console.log("Writing data to file");

            /* write the tweets to the file */
            fs.write(fd, JSON.stringify(tweets, null, 4));
          });
        });      
      }
      else if (data.mode == "CSV") {
        /* check if the file exists */
        fs.exists("csv_output.csv", function(exists) {
          if (!exists) {
            console.log("File does not exist - will create it");
          }

          else {
            console.log("File exists - will overwrite file");
          }

          /* open the file for writing */
          fs.open(data.filename + ".csv", "w", function(error, fd) {
            
            /* callback function to convert to csv */
            var json2csvCallback = function (err, csv) {
              if (err) throw err;

              /* write the tweets to the file */
              fs.write(fd, csv);
            };

            /* call the converter function */
            converter.json2csv(tweets, json2csvCallback);
          
          });
        });
      }
      else {
        console.log("Unknown file output");
      }
    });
  });
});
