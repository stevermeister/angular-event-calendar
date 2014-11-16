app.service('CalendarService', function() {

  this.normalize = function(events) {

    for(var i = 0; i < events.length; i++){
      for(var j = i; j < events.length; j++){
        if(i === j){
          continue;
        }

        if(isCollision(events[i], events[j])){
          events[i].collisions = events[i].collisions || [];
          events[i].collisions.push(j);
          events[i].row = events[i].row || 0;
          events[j].row = events[j].row || 0;
          events[j].row = events[i] + 1;
        }

      }
    }

    function isCollision(event1, event2) {
      if(event1.end < event2.end && event2.start < event1.end
        || event2.end < event1.end && event1.start < event2.end){
        return true;
      }

      return false;
    }
    
    return events;
  };
  
  });
