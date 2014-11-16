app.directive('eventBox', function(){
  return {
    restrict: 'E',
    templateUrl: 'calendar/views/eventBox.html',
    replace: true,
    link: function(scope, element) {

      element.css({
        top: scope.event.start,
        width: element.parent().width(),
        height: (scope.event.end - scope.event.start) || element.height(),
        rigth: scope.event.right? 0: false
      });
    }
  };
});