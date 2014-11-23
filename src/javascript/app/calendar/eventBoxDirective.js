angular.module('calendar').directive('eventBox', function(){
  'use strict';

  return {
    restrict: 'E',
    templateUrl: 'calendar/views/eventBox.html',
    replace: true,
    link: function(scope, element) {

      element.css({
        top: scope.event.start,
        width: (element.parent().width() - 10)/ (scope.event.siblings.length + 1),
        height: (scope.event.end - scope.event.start) || element.height(),
        left: scope.event.column * element.parent().width()/ (scope.event.siblings.length + 1)
      });
    }
  };
});