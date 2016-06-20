var app = angular.module("RouterApp", ["ngRoute","firebase"]);

app.config(function($routeProvider) {
  $routeProvider.when("/login", {
    controller: "LoginCtrl",
    templateUrl: "./login.html"
  })
  $routeProvider.when("/", {
    controller: "ProfileCtrl",
    templateUrl: "./profile.html"
  })
  $routeProvider.when("/form", {
    templateUrl: "./form.html"
  })
  $routeProvider.otherwise("/", {
    templateUrl: "./login.html"
  })
});

app.controller("LoginCtrl", function($scope, $firebaseAuth, $location) {
  var auth= $firebaseAuth();
  auth.$onAuthStateChanged(function(firebaseUser){
    if (firebaseUser) {
      $location.path("/")
    }
  })
  $scope.signIn=function () {
    auth.$signInWithPopup("facebook")
     .catch(function(error) {
       $scope.error = error;
     });
  }
}); 

app.controller("ProfileCtrl", function($firebaseAuth, $scope, $location){
  var auth= $firebaseAuth();
  
  auth.$onAuthStateChanged(function(firebaseUser){
    if (firebaseUser) {
      $scope.firebaseUser=firebaseUser;
      console.log(firebaseUser);
    }
    else{
      $location.path("/login");
    }
  })

  $scope.signOut=function(){
    auth.$signOut(); 
    $location.path("/login");
  }
});





