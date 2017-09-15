var express = require('express');
var router = express.Router();
var sql = require('mssql');
var session = require('express-session');
var dateFormat = require('dateformat');
var validator = require('validator');

//flash messages
var session = require('express-session');

var path = require('path');
var fs = require('file-system');
var os = require('os');

router.get('/removeOneLogo/:logoId', function(req, res, next) {
        console.log(req.params.logoId);
        var request = new sql.Request();
        request.query( "DELETE FROM Customer_Logos WHERE logoID ='"+req.params.logoId+"'", function (err, result) {
            if (err) throw err;
            req.flash('message', 'Logo deleted!');
            res.redirect('/MyLogos');
        });
});

router.post('/createAndAddLogo', function(req, res, next) {
    if(req.user){
        if(!validator.isAlphanumeric(req.body.logoName))
        {
            console.log('isAlpha');
            req.flash('message', 'Error: Upload Unsuccesful. Invalid Characters in Logo Name');
            return res.redirect('/CreateLogo');
        }
        var request = new sql.Request();
        var date = new Date().toISOString();
        date = date.substring(0,10);
        
        request.query("INSERT INTO Customer_Logos(logoId,customerId,dateCreated,logoName, filePath)VALUES (NEWID(), '"+req.user.customerId+"','"+date+"','" + req.body.logoName +'.png'+ "','" + 'static/assets/user_icons/' + "')", function (err, result) {
            if (err) 
            {
                req.flash('message', 'Something went wrong with uploading.');
                res.redirect('/');
            }
            console.log("Logo was inserted");
            request.query("SELECT logoId,logoName FROM Customer_Logos WHERE logoName =  '"+req.body.logoName+ '.png' +"'", function(err, results){
                if (err) throw err;

                /* turns the data url to an img format*/
                var dataURL = req.body.dataURL.replace(/^data:image\/\w+;base64,/, "");
                var buf = new Buffer(dataURL, 'base64');
                var logopath = 'public/assets/user_icons/' + results[0].logoId + results[0].logoName;
                /* writes the img to the server */
                fs.writeFile(logopath, buf);
            });
            req.flash('message', 'Uploaded new Logo!');
            res.redirect('/MyLogos');
        });
    }else{
        req.flash('message', 'Must be logged in to create Logo!');
        res.redirect('/');
    }
    
});

router.get('/', function(req, res, next) {
    //if the user exists then render the homepage with the user variable
    if(req.user){
        res.render('partials/homepartial.ejs', {req: req, user: req.user});
    }
    //else render the home page without the user variable
    else {
        res.render('pages/login.ejs', {req: req});
    }
});

router.get('/Help', function(req, res, next) {
    if(req.user){
        res.render('partials/helppartial', {user: req.user});
    }
    //else render the home page without the user variable
    else {
        req.flash('message', 'Must be logged in to do that!');
        res.redirect('/');
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
                
                request.query("SELECT filePath,bgName FROM Default_BgImages ", function (err, bgImages) {       
                if (err) console.log(err);
                res.render('partials/canvaspartial', {results: results, bgImages: bgImages,user: req.user, req: req});
                
                });
            });//end query
        });//end query
    }//end if
    //else render the home page without the user variable
    else {
        req.flash('message', 'Must be logged in to create logo!');
        res.redirect('/');
        
    }//end else
});

router.get('/MyLogos', function(req, res, next) { 
    if(req.user){
        
        var request = new sql.Request();
        request.query("SELECT logoName,logoID, customerId FROM Customer_Logos WHERE customerId = '"+req.user.customerId+"'", function(err, results){
            if (err) throw err;
            console.log(results[0]);
            res.render('partials/logospartial', {sql: results, user: req.user, req: req});
        });
    }
    //else render the home page without the user variable
    else {
        req.flash('message', 'Must be logged in to view Logos!');
        res.redirect('/');
    }
});
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('message', 'Return to make more Logos!')
  res.redirect('/');
});

module.exports = router;
