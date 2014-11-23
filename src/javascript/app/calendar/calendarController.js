angular.module('calendar').controller('CalendarController', function($scope, CalendarService, $window) {
    'use strict';

      $scope.events =  CalendarService.setEvents(mocks.events);

      var externalFuncationName = 'lay' + 'OutDay';
      $window[externalFuncationName] = function(events) {
        return (!angular.isArray(events)) ? events
          : ($scope.events = CalendarService.setEvents(events)) && $scope.$digest();
      };


  });