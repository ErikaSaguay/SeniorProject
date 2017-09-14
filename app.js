var express = require('express');
var app = express();
var expressLayouts = require('express-ejs-layouts');
var engine = require('ejs-locals');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var http = require('http');
var sql = require('mssql');
var passwordHash = require('password-hash');
var passport = require('passport');
var flash = require('connect-flash-plus');

require('./models/dbconnection');

var routes = require('./routes/index');
var auth = require('./routes/auth');

//make the app use the /static directory to pull all the js and css from public
//app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("views"));

//initialize passport and the session variable that will hold the user info. 
app.use(session({ 
    secret: 'keyboard cat',
    resave: true, 
    saveUninitialized:true})); // session secret

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());




app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressLayouts);

app.use(cookieParser());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));


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

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({           
        "error": {
            "message": err.message,
            "status" : err.status
        }                    
    });
});

module.exports  = app;
