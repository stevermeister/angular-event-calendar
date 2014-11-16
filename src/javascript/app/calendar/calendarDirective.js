app.directive('calendar', function(){
  return {
    restrict: 'E',
    templateUrl: 'calendar/views/calendar.html',
    replace: true
  };
});