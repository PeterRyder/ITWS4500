var socket = io.connect('http://localhost:3000');

(function(angular) { 
  'use strict';
  /* store the app variable */
  var app = angular.module('TwitterAPI', []);

  /* using the controller */
  app.controller('Controller', function($scope) {
    var tweets_received = 0;

    $scope.output_modes = ['JSON', 'CSV'];
    $scope.selectedItem = "JSON";
    $scope.amount = 10;

    $scope.KeyPressed = function(event) {
      if (event.charCode == 13) {
        $scope.search();
      }
    }

    /* search function bound to search button */
    $scope.search = function() {
      /* ensure connection to server */
      socket = io.connect('http://localhost:3000');

      /* angular array to store tweets in */
      $scope.tweets = [];
      console.log("Searching for " + $scope.input.text);

      /* tell the server we want to start querying for tweets */
      socket.emit('query', $scope.input.text);

      /* listener for tweets coming from server */
      socket.on('tweets', function(data) {
        for (var i = 0; i < data.length; i++) {
          if (tweets_received < $scope.amount) {
            $scope.tweets.push(data[i]);
            $scope.$apply();
            tweets_received += 1;          }
        }
      });
    };

    /* button bound to building the database */
    $scope.build_database = function() {
      console.log("Building new database using query " + $scope.input.text);

      /* ensure connection to server */
      socket = io.connect('http://localhost:3000');

      /* tell the server we want to build the database */
      socket.emit('build', $scope.tweets);
    };

    $scope.read_tweets = function() {
      console.log("Reading tweets from database");
    };

    /* button bound to creating an xml file from the database */
    $scope.create_xml = function() {
      console.log("Outputting XML from database");

      /* tell the server we want to create the xml file */
      socket.emit('output_from_db', $scope.filename);
    };

    /* function which outputs the tweets to either csv or json */
    $scope.output = function() {
      socket.emit('output', {tweets: $scope.tweets, mode: $scope.selectedItem});
      socket.close();
    };

  });
})(window.angular);