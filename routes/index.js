var express = require('express');
var router = express.Router();
var sql = require('mssql');
var session = require('express-session');
var dateFormat = require('dateformat');

//flash messages
var session = require('express-session');
var flash = require('connect-flash-plus');

var path = require('path');
var fs = require('file-system');
var os = require('os');

var iconName = "Planner";

router.post('/getOneLogo', function(req, res, next) {
    var request = new sql.Request();
    request.query("SELECT filePath FROM Customer_Logos WHERE logoID =  '"+req.body.pictureId+"'", function(err, results){
        if (err) throw err;
        res.render('partials/logospartial', {user: req.user});
    });
});

router.post('/insertLogo', function(req, res, next) {
    
    var request = new sql.Request();
    
    var date = new Date().toISOString();
    
    request.query("INSERT INTO Customer_Logos(customerId,logoName,dateCreated)VALUES ('"+req.body.logoName+"','"+req.body.customerId+"','"+date+"')", function (err, result) {
        if (err) throw err;
        console.log("Logo was inserted");
        //should show how many rows were effected;
    });
});

router.get('/removeOneLogo/:logoId', function(req, res, next) {
        console.log(req.params.logoId);
        var request = new sql.Request();
        request.query( "DELETE FROM Customer_Logos WHERE logoID ='"+req.params.logoId+"'", function (err, result) {
            if (err) throw err;
            res.redirect('/MyLogos');
        });
});

router.post('/createAndAddLogo', function(req, res, next) {

    var request = new sql.Request();
    
    var date = new Date().toISOString();

    console.log(date);
    date = date.substring(0,10);
    
    request.query("INSERT INTO Customer_Logos(logoId,customerId,dateCreated,logoName, filePath)VALUES (NEWID(), '"+req.user.customerId+"','"+date+"','" + req.body.logoName +'.png'+ "','" + 'static/assets/user_icons/' + "')", function (err, result) {
        if (err) throw err;
        console.log("Logo was inserted");
        //should show how many rows were effected;
        var request = new sql.Request();
        request.query("SELECT logoId,logoName FROM Customer_Logos WHERE logoName =  '"+req.body.logoName+ '.png' +"'", function(err, results){
            if (err) throw err;

            var dataURL = req.body.dataURL.replace(/^data:image\/\w+;base64,/, "");
            var buf = new Buffer(dataURL, 'base64');
            var logopath = 'public/assets/user_icons/' + results[0].logoId + results[0].logoName;
            fs.writeFile(logopath, buf);
        });
            req.flash('message', 'Uploaded');
            res.redirect('/');
    });
});

router.get('/', function(req, res, next) {
    //if the user exists then render the homepage with the user variable
    if(req.user){
        res.render('partials/homepartial.ejs', {req: req, user: req.user});
    }
    //else render the home page without the user variable
    else {
        res.render('pages/login', {req: req});
    }
});

router.get('/Help', function(req, res, next) {
    if(req.user){
        res.render('partials/helppartial', {user: req.user});
    }
    //else render the home page without the user variable
    else {
        res.render('pages/login', {req: req});
    }
});

router.get('/CreateLogo', function(req, res, next) { 
    if(req.user){
        //create request var fro sql query
        var request = new sql.Request();
        //put the result into an arry to access later on
        request.query("SELECT iconName,filePath FROM Default_Icons ", function (err, results) {       
        if (err) console.log(err);

            request.query("SELECT filePath,bgName FROM Default_BgImages ", function (err, bgImages) {       
                if (err) console.log(err);
                res.render('partials/canvaspartial', {results: results, bgImages: bgImages,user: req.user});
            });//end query
        });//end query
    }//end if
    //else render the home page without the user variable
    else {
        res.render('pages/login', {req: req});
    }//end else
});

router.get('/MyLogos', function(req, res, next) { 
    if(req.user){
        
        var request = new sql.Request();
        request.query("SELECT logoName,logoID, customerId FROM Customer_Logos WHERE customerId = '"+req.user.customerId+"'", function(err, results){
            if (err) throw err;
            console.log(results[0]);
            res.render('partials/logospartial', {sql: results, user: req.user});
        });
    }
    //else render the home page without the user variable
    else {
        res.render('pages/login', {req: req});
    }
    
});
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
