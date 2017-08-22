var express = require('express');
var app = express();
var engine = require('ejs-locals');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash-plus');
var bodyParser = require('body-parser');
var http = require('http');
var sql = require('mssql');
var passwordHash = require('password-hash');



require('./models/dbconnection');

var routes = require('./routes/index');
var auth = require('./routes/auth');


app.use(express.static("public"));
app.use(express.static("views"));

app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());


app.use('/',routes);
app.use('/auth',auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({           
            "error": {
                "message": err.message,
                "status" : err.status
            }                    
        });
    });
}

module.exports  = app;