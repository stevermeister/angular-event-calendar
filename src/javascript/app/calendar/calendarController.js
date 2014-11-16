app.controller('CalendarController', function($scope, CalendarService, $window) {
    'use strict';

      $scope.events =  CalendarService.normalize(mocks.events);

      var externalFuncationName = 'lay' + 'OutDay';
      $window[externalFuncationName] = function(events) {
        return (!angular.isArray(events)) ? events
          : ($scope.events = CalendarService(events)) && $scope.$digest();
      };


  });