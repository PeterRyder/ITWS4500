var socket = io.connect('http://localhost:3000');

(function(angular) { 
  'use strict';
  /* store the app variable */
  var app = angular.module('TwitterAPI', []);

  /* using the controller */
  app.controller('Controller', function($scope, $window) {
    var tweets_received = 0;

    /* output file options */
    $scope.output_modes = ['JSON', 'CSV'];
    $scope.selectedItem = "JSON";
    $scope.amount = 10;

    /* if the enter key is pressed instead of clicking the search button */
    $scope.KeyPressed = function(event) {
      if (event.charCode == 13) {
        /* enable the build database option if the user hits the enter key */
        if ($scope.input.text != "") {
          $('#BuildDatabase').prop('disabled', false);
          $scope.search();
        }
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

    /* function which outputs the tweets to either csv or json */
    $scope.output = function() {
      socket.emit('output', {mode: $scope.selectedItem, filename: $scope.filename});
      socket.close();
    };

    $scope.visualize = function() {
      var url = "http://" + $window.location.host + "/visualize";
      $window.location.href = url;
    };

  });
})(window.angular);