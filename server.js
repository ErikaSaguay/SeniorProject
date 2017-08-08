
var debug = require('debug')('Express4');
var app = require('./app');
var http = require('http');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
 
});