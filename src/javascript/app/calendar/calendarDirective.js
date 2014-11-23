angular.module('calendar').directive('calendar', function(){
  'use strict';

  return {
    restrict: 'E',
    templateUrl: 'calendar/views/calendar.html',
    replace: true
  };
});