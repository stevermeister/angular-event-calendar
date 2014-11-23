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