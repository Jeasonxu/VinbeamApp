
app.controller('SuperController', ['$scope', '$window', 'UserService', ($scope, $window, UserService) => {
  $scope.$emit('enterState')
  UserService.users.query().$promise.then(data => {
    $scope.users = data._embedded.users;
  });

  let makeMap = () => {
    if(document.getElementById('super-map')){
      let useragent = navigator.userAgent;
      let mapdiv = document.getElementById("super-map");

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

  $scope.createCustomer = (customer) => {
    console.log(customer);
    // UserService.customers.create(customer, (data) => {
    //
    // })
  }

}])
