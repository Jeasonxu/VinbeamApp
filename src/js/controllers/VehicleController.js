
app.controller('VehicleController', ['$scope', '$window', '$state', 'VinbeamService', ($scope, $window, $state, VinbeamService) => {
  $scope.vehicle;
  $scope.status = [];
  $scope.generalInfo = [];

  ($scope.getVehicle = () => {
    VinbeamService.vehicles.query({vehicleId: $state.params.vehicle}).$promise.then((res) => {
      $scope.vehicle = res;
      formatInfo();
      makeMap();
    })
  })();

  let makeMap = (module) => {
    if(document.getElementById('vehicle_map')){
      let useragent = navigator.userAgent;
      let mapdiv = document.getElementById("vehicle_map");

      let myLatlng = new google.maps.LatLng($scope.vehicle.latitude, $scope.vehicle.longitude);
      let mapOptions = {
        zoom: 8,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      let map = new google.maps.Map(mapdiv, mapOptions);

      let marker = new google.maps.Marker({
          position: myLatlng,
          title:"Vehicle Location"
      });

      marker.setMap(map);
    }
  }

  let formatInfo = () => {
    console.log($scope.vehicle);
  }

}])
