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

  function initialize() {
    getLocation(); 
  }
  // google.maps.event.addDomListener(window, 'load', initialize);

  function getLocation(){
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      // default location
    }
  }

  function success(position){
    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapOptions = {
      center: latlng,
      scrollWheel: false,
      zoom: 12
    };
    
    var marker = new google.maps.Marker({
        position: latlng,
        url: '/',
        animation: google.maps.Animation.DROP
    });
    
    var map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);
    
    marker.setMap(map);
  }

  function error(msg){
    if (msg.code == 1) {
        //PERMISSION_DENIED 
    } else if (msg.code == 2) {
        //POSITION_UNAVAILABLE 
    } else {
    }   //TIMEOUT
  } 
});
