
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
      $location.path("/");
    }
  })
  $scope.signIn=function () {
    auth.$signInWithPopup("facebook")
     .catch(function(error) {
       $scope.error = error;
     });
  }
}); 

app.controller("ProfileCtrl", function($firebaseAuth, $firebaseObject, $scope, $compile, $location, $firebaseArray, $http, $window){
  var auth= $firebaseAuth();
  
  auth.$onAuthStateChanged(function(firebaseUser){
    if (firebaseUser) {
      $scope.displayName = firebaseUser.displayName;
      $scope.userEmail = firebaseUser.email;
      $scope.profPic = firebaseUser.photoURL;
      console.log("FIREBASE USER", firebaseUser)
    
      var currUser = firebaseUser;
      console.log("CURR USER", currUser);
      var userName = currUser.displayName;
      var usersRef = firebase.database().ref().child("users");
      
      $scope.allUsers = $firebaseArray(usersRef);
      console.log("ALL USERS", $scope.allUsers)

      var curUserRef = firebase.database().ref().child("users").child(userName);
      $scope.user = $firebaseObject(curUserRef);
      console.log("THE USER", $scope.user);
      //create user if it doens't exist yet

      $scope.user.$loaded().then(function() {
        $scope.locations = $scope.user.locations;
        console.log("LOCATIONS", $scope.locations);  
      })
    

      // addition of google maps 
      var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
      })


// FOR FORM IN MAP
      $scope.submitPlaceForm = function() {
        $scope.user.$loaded().then(function() {
          console.log("submitted",locObj, $scope.location, $scope.type);
          var currUser = firebaseUser;
          var userName = currUser.displayName;
          var locRef = firebase.database().ref().child("users").child(userName).child("locations").child($scope.location).child($scope.type).child($scope.place_name);
          var locObj = $firebaseObject(locRef);
          locObj.name = $scope.place_name;
          locObj.description = $scope.description;
          locObj.$save();
          $scope.locations = $firebaseArray(firebase.database().ref().child("users").child(userName).child("locations"));
       });   
      }
    
      setTimeout(function() {
      var form = $compile($("<div><header>NEW PIN</header>"+
          "<hr>"+
          "<form id='form' class='topBefore'>"+
          "<input id='name' type='text' placeholder='PLACE' ng-model='place_name'>"+
          "<br>"+
          "<br>"+
          "<select class='c-select' ng-model='type' width='100%'>"+
          "<option selected>What Type?</option>"+
          "<option value='Restaurant'>Restaurant</option>"+
          "<option value='Shopping'>Shopping</option>"+
          "<option value='Nightlife'>Nightlife</option>"+
          "</select>"+
          "<br>"+
          "<br>"+
          "<input type='text' id='location' placeholder='LOCATION' ng-model='location'>"+
          "<br>"+
          "<br>"+
          "<textarea id='message' type='text' placeholder='DESCRIPTION' ng-model='description'></textarea>"+
          "<br>"+
          "<input id='submit' type='submit' value='Pin it!' ng-click='submitPlaceForm()' />"+
          "</form></div>"))($scope);
          console.log(form)

      infowindow = new google.maps.InfoWindow({
       content: form[0],
      });
    },100);




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
        map: map,
        title: "Hello World!"
      });
      google.maps.event.addListener(marker, "click", function() {
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

app.controller("FormCtrl", function($firebaseAuth, $http, $scope, $location, $firebaseArray, $firebaseObject){
   var auth= $firebaseAuth();
  auth.$onAuthStateChanged(function(firebaseUser){
    if (firebaseUser) {
      var currUser = firebaseUser;
      console.log(currUser);
      var userName = currUser.displayName;
      var usersRef = firebase.database().ref().child("users");
      
      $scope.allUsers = $firebaseArray(usersRef);
      console.log($scope.allUsers)

      var curUserRef = firebase.database().ref().child("users").child(userName);
      var user = $firebaseObject(curUserRef);
      console.log(user.locations);

      if(!user["locations"]) {
        console.log("NO");
        user["locations"] = { };
      }
      
      console.log("thetest", user["locations"]);

      $scope.submitPlaceForm = function() {
        if(!user["locations"]) {
          console.log("NO");
          user["locations"] = { };
        }
        if(user.locations[$scope.location]) { //user already has this location
          if(user.locations[$scope.location][$scope.type]) { //user already has this category in this location
            var placeObj = { "name": $scope.place_name, "description": $scope.description };
            console.log(placeObj);
            user.locations[$scope.location][$scope.type].push(placeObj);
            user.$save();
            console.log("SAVED", user);
          } else { //need to add this category to this location
              var placeObj = { "name": $scope.place_name, "description": $scope.description };
              user.locations[$scope.location][$scope.type] = [];
              user.locations[$scope.location][$scope.type].push(placeObj);
              user.$save();
              console.log("SAVED", user);
          }
        } else { //user does not have this location, so need to add it
            var placeObj = { "name": $scope.place_name, "description": $scope.description };
            user.locations[$scope.location] = {};
            user.locations[$scope.location][$scope.type] = []
            user.locations[$scope.location][$scope.type].push(placeObj);           
            user.$save();
            console.log("SAVED", user);
        }
      }
  }  
})

});