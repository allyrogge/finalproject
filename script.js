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
      var profPic = $scope.firebaseUser.photoURL;
      

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
    //   $scope.profPic=function(){
    //   $http({
    //     method: "GET",
    //     url: "/v2.6/{user-id}/picture"
    //     Host: graph.facebook.com
    //   }).then(function(response) {
    //     console.log("success pic")
    //   }
    // }
      console.log($scope.allUsers);
      console.log(firebaseUser);
      // addition of google maps 

    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8
    })

    var service = new google.maps.places.PlacesService(map);

    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    
    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    map.addListener('click', function(event) {
      var marker = new google.maps.Marker({
        position: event.latLng,
        title: "Hello World!"
      });
      marker.setMap(map);
      var infowindow = new google.maps.InfoWindow({
        content: "my info window"
      });
      marker.addListener('click', function() {
        infowindow.open(map, marker);
      });
    });

    searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            }));

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
        });

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
