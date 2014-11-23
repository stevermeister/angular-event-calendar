(function(window) {
  'use strict';

  var app = angular.module('calendar', ['app-templates']);

  window.app = app;
})(window);
angular.module('calendar').controller('CalendarController', ["$scope", "CalendarService", "$window", function($scope, CalendarService, $window) {
    'use strict';

      $scope.events =  CalendarService.setEvents(mocks.events);

      var externalFuncationName = 'lay' + 'OutDay';
      $window[externalFuncationName] = function(events) {
        return (!angular.isArray(events)) ? events
          : ($scope.events = CalendarService.setEvents(events)) && $scope.$digest();
      };


  }]);
angular.module('calendar').directive('calendar', function(){
  'use strict';

  return {
    restrict: 'E',
    templateUrl: 'calendar/views/calendar.html',
    replace: true
  };
});
angular.module('calendar').service('CalendarService', ["$window", function($window) {
  'use strict';

  var _events = [],
    _columns = [];

  this.addEvent = function(event) {

    if(!_checkEvent(event)){
      $window.console.error('Event dimensions are not correct: (' + event.start + ', ' + event.end + ')' );
      return false;
    }

    var newEventIndex = _events.length,
      columnCollisionEvents = [],
      totalCollisionElements = [],
      injected = false;
    event.siblings = [];
    event.column = 0;
    _events.push(event);

    for(var i = 0; i < _columns.length; i++){
      columnCollisionEvents = _getColumnCollisionEvent(event, _columns[i]);
      if(columnCollisionEvents.length === 0 && !injected){
        event.column = i;
        _columns[i].push(newEventIndex);
        injected = true;
      } else {
        _addSiblingColumn(event, i);
        totalCollisionElements = totalCollisionElements.concat(columnCollisionEvents);
      }
    }

    if(!injected){
      //no place - we need to create new column
      event.column = _columns.length;
      _columns[_columns.length] = [newEventIndex];
    }

    _updateSiblings(totalCollisionElements, event.column);

    return event;
  };

  this.setEvents = function(newEvents) {
    _events = [];
    _columns = [];
    for(var i = 0; i < newEvents.length; i++){
      this.addEvent(newEvents[i]);
    }
    return _events;
  };


  function _isCollision(event1, event2) {

    return (
        event1.end >= event2.end && event1.start <= event2.start  ||
        event1.end <= event2.end && event1.start >= event2.start  ||
        event1.end <= event2.end && event1.end > event2.start ||
        event1.start >= event2.start && event1.start < event2.end);
  }

  function _getColumnCollisionEvent(event, column){
    var collisionEvents = [];
    for(var i = 0; i < column.length; i++){
      if(_isCollision(event, _events[column[i]])){
        collisionEvents.push(column[i]);
      }
    }
    return collisionEvents;
  }

  function _updateSiblings(eventSiblingIndexes, column){
    for(var i = 0; i < eventSiblingIndexes.length; i++){
      _addSiblingColumn(_events[eventSiblingIndexes[i]], column);
    }
  }

  function _addSiblingColumn(event, column){
    if(event.siblings.indexOf(column) === -1){
      event.siblings.push(column);
    }
  }

  function _checkEvent(event){


    if(!angular.isNumber(event.start) ||
       !angular.isNumber(event.end) ||
       event.start < 0 ||
       event.end < 0 ||
       event.start > 720 ||
       event.end > 720
    ){
      return false;
    }

    return true;
  }

}]);

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
angular.module('calendar').filter('midday', function () {
  'use strict';

  function middayFilter(hours){
    return Math.floor(hours / 12) ? 'PM' : 'AM';
  }
  return middayFilter;
});

angular.module('calendar').filter('h12', function () {
  'use strict';

  function h12Filter(hours){
    return ((hours % 12) || 12);
  }
  return h12Filter;
});
angular.module('calendar').directive('timeline', function(){
  'use strict';

  return {
    restrict: 'E',
    templateUrl: 'calendar/views/timeline.html',
    link: function(scope) {
      scope.timeline = [9,10,11,12,13,14,15,16,17,18,19,20,21];

    }
  };
});
var mocks = mocks || {};
mocks["events"] = [
  {
    "start": 30,
    "end": 150
  },
  {
    "start": 540,
    "end": 600
  },
  {
    "start": 560,
    "end": 620
  },
  {
    "start": 610,
    "end": 670
  },
  {
    "start": 310,
    "end": 390
  },
  {
    "start": 340,
    "end": 400
  },
  {
    "start": 390,
    "end": 480
  },
  {
    "start": 60,
    "end": 120
  },
  {
    "start": 120,
    "end": 200
  }
];
angular.module('app-templates', ['calendar/views/calendar.html', 'calendar/views/eventBox.html', 'calendar/views/timeline.html']);

angular.module("calendar/views/calendar.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("calendar/views/calendar.html",
    "<div class=\"calender_container\">\n" +
    "  <div class=\"calender\">\n" +
    "    <div class=\"calender_box\">\n" +
    "      <event-box\n" +
    "          ng-repeat=\"event in events\"></event-box>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <timeline></timeline>\n" +
    "</div>");
}]);

angular.module("calendar/views/eventBox.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("calendar/views/eventBox.html",
    "<div class=\"event\">\n" +
    "  <p class=\"title\">Sample Item</p>\n" +
    "\n" +
    "  <p class=\"location\">Sample Location </p>\n" +
    "\n" +
    "</div>");
}]);

angular.module("calendar/views/timeline.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("calendar/views/timeline.html",
    "<div class=\"timeline\">\n" +
    "  <div>\n" +
    "    <ul>\n" +
    "      <li ng-repeat=\"hour in timeline\">\n" +
    "        <div class=\"hourpoint\">\n" +
    "          <span class=\"view_hour\">{{ hour|h12 }}:00</span>\n" +
    "          <span class=\"light view_zone\">{{ hour|midday }}</span>\n" +
    "        </div>\n" +
    "        <div class=\"hourpoint\">\n" +
    "          <span ng-if=\"!$last\" class=\"fr light view_h_hour\">{{ hour|h12 }}:30</span>\n" +
    "        </div>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "</div>");
}]);
