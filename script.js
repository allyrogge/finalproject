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
    controller: "FormCtrl",
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

app.controller("ProfileCtrl", function($firebaseAuth, $scope, $location, $firebaseArray){
  var auth= $firebaseAuth();
  
  auth.$onAuthStateChanged(function(firebaseUser){
    if (firebaseUser) {
      $scope.firebaseUser = firebaseUser;
      var userName = $scope.firebaseUser.displayName;
      var userEmail = $scope.firebaseUser.email;

      var usersRef = firebase.database().ref().child("users"); //get users part
      $scope.allUsers = $firebaseArray(usersRef); //turn that into an array

      // if(!usersRef.child("email").once(userEmail).exists()) {
      var newObj = {};
      newObj[userEmail] = {
        "locations":  { 
                "London": { "Bar": "Bar1", "Bar": "bar2" } ,
                "Paris": { "Restaurant": "Rest1", "Restaurant": "rest2"}
            }
      };
      console.log(newObj); //check that this prints what you want, then put it in the .$add
      // $scope.allUsers.$add({
      //   userEmail: { 
      //       "locations": { 
      //           "London": { "Bar": "Bar1", "Bar": "bar2" } ,
      //           "Paris": { "Restaurant": "Rest1", "Restaurant": "rest2"}
      //       }
      //   } 
 
      // }
      console.log($scope.allUsers);
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
  $scope.newForm=function(){
    $location.path("/form");
  }
 
  }); 

app.controller("FormCtrl", function($firebaseAuth, $scope, $location, $firebaseArray){
  // var currUser = firebaseUser;
  var usersRef = firebase.database().ref().child("users");
  $scope.allUsers = $firebaseArray(usersRef);
  console.log($scope.allUsers)
  // $scope.place-name = 

});





