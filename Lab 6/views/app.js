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

    $scope.search = function() {
      socket = io.connect('http://localhost:3000');
      $scope.tweets = [];
      console.log("Searching for " + $scope.input.text);
      socket.emit('query', $scope.input.text);
      socket.on('tweets', function(data) {
        for (var i = 0; i < data.length; i++) {
          if (tweets_received < $scope.amount) {
            $scope.tweets.push(data[i]);
            $scope.$apply();
            tweets_received += 1;          }
        }
      });
    };

    $scope.output = function() {
      socket.emit('output', {tweets: $scope.tweets, mode: $scope.selectedItem});
      socket.close();
    };

  });
})(window.angular);