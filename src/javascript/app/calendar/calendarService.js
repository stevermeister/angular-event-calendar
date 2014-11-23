angular.module('calendar').service('CalendarService', function($window) {
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

});
