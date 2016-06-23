
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

app.controller("ProfileCtrl", function($firebaseAuth, $firebaseObject, $scope, $location, $firebaseArray, $http, $window){
  var auth= $firebaseAuth();
 
  // window.fbAsyncInit = function() {
  //   FB.init({
  //     appId      : '141394309598006',
  //     xfbml      : true,
  //     version    : 'v2.1'
  //   });
  // };


  // (function(d, s, id){ UNCLEAR AS TO WHAT THIS MF DOES
  //    var js, fjs = d.getElementsByTagName(s)[0];
  //    if (d.getElementById(id)) {return;}
  //    js = d.createElement(s); js.id = id;
  //    js.src = "//connect.facebook.net/en_US/sdk.js";
  //    fjs.parentNode.insertBefore(js, fjs);
  //  }(document, 'script', 'facebook-jssdk'));

  // FB.api(
  //   "...?fields={fieldname_of_type_AgeRange}",
  //   function(response) {
  //     if (response&& !response.error) {
  //       console.log(response)
  //     }
  //   }
  //   );
  auth.$onAuthStateChanged(function(firebaseUser){
    if (firebaseUser) {
      $scope.firebaseUser = firebaseUser;
      var userName = $scope.firebaseUser.displayName;
      var userEmail = $scope.firebaseUser.email;
      var profPic = $scope.firebaseUser.photoURL;
      var ageRange =$scope.firebaseUser.age_range;
      console.log(firebaseUser)
      
      var usersRef = firebase.database().ref().child("users").child(userName); //get users part
      $scope.theUser = $firebaseObject(usersRef); //turn that into an array

      // if(!usersRef.child("email").once(userEmail).exists()) {
      $scope.theUser["locations"] = { 
              //   "London": { "Bar": ["Bar1", "Bar2"]
              // }, 
              //   "Paris": {
              //     "Restaurant": ["Rest1", "Rest2"]
              //   }
      };
      
      $scope.theUser.$save();

      //get the user's object
      //check if that city is there already
      //if it is, add to the bar/restaurant/etc
      //if it's not, theUser["locations"].add (??) the city, then add "Restaurant" then the name
      console.log($scope.theUser);
      $scope.theUser["locations"]["Cape Town"] = { "Restaurant": ["W17"] };
      $scope.theUser["locations"]["Cape Town"]["Restaurant"].push("deli place");
      $scope.theUser.$save(); 
      // addition of google maps 

    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8
    })

    infowindow = new google.maps.InfoWindow({
     content: 
     "<header>NEW PIN</header>"+
     "<hr>"+
     "<form id='form' class='topBefore'>"+
    "<input id='name' type='text' placeholder='Place' ng-model='place_name'>"+
    "<br>"+
    "<br>"+
    "<select class='c-select' ng-model='type' width='100%'>"+
    "<option selected>What Type?</option>"+
    "<option value='1'>Restaurant</option>"+
    "<option value='2'>Shopping</option>"+
    "<option value='3'>Nightlife</option>"+
    "</select>"+
    "<br>"+
    "<br>"+
    "<input type='text' id='location' placeholder='Location' ng-model='location'>"+
    "<br>"+
    "<br>"+
    "<textarea id='message' type='text' placeholder='Description' ng-model='description'></textarea>"+
    "<br>"+
    "<input id='submit' type='submit' value='Pin it!'' ng-click='submitPlaceForm()''>"+
    "</form>",

    });

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

app.controller("FormCtrl", function($firebaseAuth, $scope, $location, $firebaseArray, $firebaseObject){
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
      $scope.submitPlaceForm = function() {
        user.locations[$scope.location]["Restaurant"] = "hey";
        console.log(user);
        user.$save();
        $location.path("/profile")
    }
  }
  
})
  // $scope.submitPlaceForm=function(){
  //   var place_name=$scope.place_name
  //   console.log(place_name)
  //   var location=$scope.location
  //   var description=$scope.description
  //   console.log(location)
  //   console.log(description)
    
  //   $location.path("/profile");
  // }
  
});