var app = angular.module("RouterApp", ["ngRoute","firebase"]);

app.config(function($routeProvider) {
  $routeProvider.when("/", {
    templateUrl: "./login.html"
  })
  $routeProvider.when("/profile", {
    templateUrl: "./profile.html"
  })
});

app.controller("TopCtrl", function($scope, $http, $firebaseObject) {
  $scope.articles = [];
  $http({
    method: "GET",
    url: "https://api.nytimes.com/svc/topstories/v2/opinion.json" +
     "?api-key=6c1830c231564612bbf5484ce7933e27"
  }).then(function(response) {
    $scope.articles = response.data.results;
    console.log(response.data.results);
  });
});

app.controller("SearchCtrl", function($scope) {
  $scope.searchTerm = "";
  $scope.search = function() {
    console.log("search clicked");
    // Code for search here.
  };
});
