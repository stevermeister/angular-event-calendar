app.directive('timeline', function(){
  return {
    restrict: 'E',
    templateUrl: 'calendar/views/timeline.html',
    link: function(scope) {
      scope.timeline = [9,10,11,12,13,14,15,16,17,18,19,20,21];

    }
  };
});