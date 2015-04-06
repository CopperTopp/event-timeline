angular.module('relcalApp', []);

var _restpaths = new RestPaths();

angular.module('relcalApp').controller("TimelineController",
                                       ['$scope', '$http', 'tooltip',
                                        function ($scope, $http, tooltip_service) {
  console.log("TimelineController loaded...");
  console.log("Getting Events for Timeline...");
  var today = new Date();
  var start_time = (new Date()).setDate(today.getDate() - 7);
  var end_time   = (new Date()).setDate(today.getDate() + 7);
  $scope.timeline_domain = {
    start_time: start_time,
    end_time:   end_time
  };
  $http.get(_restpaths.tooltip_template())
  .success(function(template) {
    tooltip_service.initialize(template);
  });
  
  $http.get(_restpaths.events())
  .success(function(events) {
    console.log("Timeline Events Loaded.");
    //release.product.link = _linkpaths.product(release.product._id);
    //release.link = _linkpaths.release(release._id);
    $scope.events = events;
  })
  .error(function(err) {
    console.log("Getting Events threw an error: " + JSON.stringify(err, null, 2));
  });
}]);