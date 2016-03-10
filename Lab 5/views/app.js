(function(angular) { 
  'use strict';
  /* store the app variable */
  var app = angular.module('TwitterAPI', []);

  app.factory("io", function() {
    return io.connect('http://localhost:3000');
  });

  /* using the controller */
  app.controller('Controller', function($scope, $http, $window, io) {

    /* array to store tweets in */
    var items = [];
    /* when the search button is pressed */
    $scope.search = function() {
      
      /* get data from server */
      io.on('tweet', function(data) {
        console.log(data);
      });
    };
  });
})(window.angular);