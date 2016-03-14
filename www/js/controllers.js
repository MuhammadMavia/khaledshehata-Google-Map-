angular.module('starter.controllers', [])
  .controller('MapCtrl', function ($scope, $stateParams, $cordovaGeolocation) {
    var map, marker;

    var myLatLng = new google.maps.LatLng(-25.363882, 131.044922);
    var geocoder = new google.maps.Geocoder();

    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 5,
      center: myLatLng
    });

    marker = new google.maps.Marker({
      position: {lat: map.center.lat(), lng: map.center.lng()},
      map: map
    });

    map.addListener('center_changed', function () {
      myLatLng = new google.maps.LatLng(map.center.lat(), map.center.lng());
      marker.setPosition(myLatLng);
      GetAddress();
    });


    function GetAddress() {
      geocoder.geocode({'latLng': myLatLng}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            $scope.currentLocation = results[1].formatted_address;
            $scope.$apply();
          }
        }
      });
    }
    GetAddress();
    $scope.getLatLng = function () {
      geocoder.geocode({'address': $scope.currentLocation}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          map.panTo({lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()});
          map.setZoom(15);
        } else {
          alert("Something got wrong " + status);
        }
      });
    };
    $scope.setMyPosition = function () {
      var posOptions = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          var lat = position.coords.latitude;
          var long = position.coords.longitude;
          map.panTo({lat: lat, lng: long});
          map.setZoom(15);
          /*new google.maps.Circle({
            strokeColor: '#73bff1',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#abd8f4',
            fillOpacity: 0.35,
            map: map,
            center: {lat: lat, lng: long},
            radius: Math.sqrt(25) * 100
          });*/
        }, function (err) {
          alert("Error")
        });
    };
    //$scope.setMyPosition();


  });
