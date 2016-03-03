
app.controller('DashController', ['$scope', '$window', 'DashService', ($scope, $window, DashService) => {
  $scope.$emit('enterState')

  let makeMap = () => {
    if(document.getElementById('map')){
      let useragent = navigator.userAgent;
      let mapdiv = document.getElementById("map");

      var myLatlng = new google.maps.LatLng(47.609, -122.333);
      var mapOptions = {
        zoom: 8,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      new google.maps.Map(mapdiv, mapOptions);
    }
  }

  $scope.$on('$viewContentLoaded', () => {
    makeMap();
  });


}])
