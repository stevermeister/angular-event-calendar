var express = require('express'),
  app = express(),
  PROJECT_DIR = '/src';


app.configure(function() {
  var folder = 'PhantomJS 1.9.7 (Mac OS X)';
  app.use('/report', express.static(__dirname + '/build/coverage/' + folder + '/'));
  app.use('/css', express.static(__dirname + PROJECT_DIR + '/css'));
  app.use('/javascript', express.static(__dirname + PROJECT_DIR + '/javascript'));
  app.use(express.bodyParser());
});

app.all('/*', function(req, res) {
  res.sendfile('index.html', { root: __dirname + PROJECT_DIR });
});

//app.listen(3000);
module.exports = app;