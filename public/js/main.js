var app = angular.module('myApp', []);
app.controller('appCtrl',function($scope,$http){
    var socket = io.connect();
    $scope.uiElement = {};
    //$scope.uiElement.userCount = 1;
    var marker=[];

    $scope.createMap = function(){

      var mapCanvas = document.getElementById('map');
      var mapsData = {
        center: new google.maps.LatLng(12.971598700000001, 77.59696595927733),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      map = new google.maps.Map(mapCanvas, mapsData);
    };

    $scope.createMap();

    $scope.createMarkers=function(){
      function onPositionUpdate(position) {
          myLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          /* socket connection */
          //var data = {name:"prabhakar"}
          console.log(myLatLng)
          socket.emit('browserLocation',{data:myLatLng});
          socket.on('locations',function(data){
            /* Clear all markers */
            for (var i = 0; i < marker.length; i++) {
                marker[i].setMap(null);
              }

            marker=[];
            var dataArray = data.data;
            $scope.uiElement.userCount = dataArray.length;
            $scope.$apply();
            console.log(dataArray)
                var i = 0;

                dataArray.forEach(function(e){
                  /* create markers */
                  marker[i] = new google.maps.Marker({
                    position: new google.maps.LatLng(e.location.H, e.location.L),
                    title: 'Hello World!',
                    visible: true
                  });
                  marker[i].setMap(map);
                  i++
                });


          });
      }

      if (navigator.geolocation)
          navigator.geolocation.getCurrentPosition(onPositionUpdate);
      else
          alert("navigator.geolocation is not available");
    };

    $scope.createMarkers();

    $scope.loginUser = function(){
      alert('login user')
    }

    $scope.registerUser = function(){
      var username = $scope.username;
      var email = $scope.email;
      var gender = $scope.gender;
      var location = $scope.location;
      var password = $scope.password;
      $http.post("/registerUser",
        {username:username,email:email,gender:gender,location:location,password:password})
        .success(function(response) {
          console.log(response)
      });
      
    }
});
