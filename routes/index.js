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
        if(req.body.dataURL == ''){
            req.flash('message', 'Must at least have background color!');
            return res.redirect('/CreateLogo');
        }
        var request = new sql.Request();
        var date = new Date().toISOString();
        date = date.substring(0,10);
        
        /* replaces non-alphanumerical characters with white spaces*/
        var logoName = req.body.logoName.replace(/\W+/g, " ");

        /* trims white spaces*/
        logoName = logoName.replace(/\s/g,'');

        request.query("INSERT INTO Customer_Logos(logoId,customerId,dateCreated,logoName, filePath)VALUES (NEWID(), '"+req.user.customerId+"','"+date+"','" + logoName +'.png'+ "','" + 'static/assets/user_icons/' + "')", function (err, result) {
            if (err) 
            {
                req.flash('message', 'Something went wrong with uploading.');
                res.redirect('/');
            }
            request.query("SELECT logoId,logoName FROM Customer_Logos WHERE logoName =  '"+logoName+ '.png' +"'", function(err, results){
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
    res.render('partials/homepartial.ejs', {req: req});
});

router.get('/Help', function(req, res, next) {
    res.render('partials/helppartial', {req: req});
});

router.get('/Contact', function(req, res, next) {
    res.render('partials/helppartial', {req: req});
});

router.get('/Login', function(req, res, next) {
    res.render('pages/login.ejs', {req:req});
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
                
                request.query("SELECT fontName FROM Default_Fonts ", function (err, fontNames) {       
                    if (err) console.log(err);
                    res.render('partials/canvaspartial', {results: results, bgImages: bgImages,user: req.user, req: req, fontNames: fontNames });

                });
            });//end query 1
        });//end query 1
    }//end if 1
    //else render the home page without the user variable
    else {
        req.flash('message', 'Must be logged in to create logo!');
        return res.redirect('/Login');
        
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
        return res.redirect('/Login');
    }
});
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('message', 'Return to make more Logos!')
  res.redirect('/');
});

module.exports = router;
