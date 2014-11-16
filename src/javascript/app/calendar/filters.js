app.filter('midday', function () {
  function middayFilter(hours){
    return postfix = (hours / 12)|0 ? 'PM' : 'AM';
  }
  return middayFilter;
});

app.filter('h12', function () {
  function h12Filter(hours){
    return ((hours % 12) || 12);
  }
  return h12Filter;
});