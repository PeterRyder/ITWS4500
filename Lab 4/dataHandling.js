$(document).ready(function() {
  /* handle pressing "enter" key while in the text box to activate button */
  $("#query-input").keyup(function(event){
      if(event.keyCode == 13){
          $("#search").click();
      }
  });
});


(function(angular) { 
  'use strict';
  /* store the app variable */
  var app = angular.module('TwitterAPI', []);

  /* using the controller */
  app.controller('Controller', function($scope, $http) {

    /* array to store tweets in */
    var items = [];

    /* when the search button is pressed */
    $scope.search = function() {
      /* angular ajax call to php function */
      $http({
        method: "GET",
        url:"get_tweets.php?q=" + $scope.input.text
      }).then(function successCallback(res) {
        /* reset the items array */
        items = [];

        /* store each status in array */
        $.each(res.data.statuses, function(key, val) {
          items.push(val);
        });
        
        /* store the array in angular model */
        $scope.tweets = items;
      }, function errorCallback(response) {
        console.log("Request failed");
      });
    };
  });
})(window.angular);