var express = require('express');
var router = express.Router();
var sql = require('mssql');
var session = require('express-session');
var path = require('path');
var fs = require('file-system');

//this function removes a single logo from the My Logo's page 
router.get('/removeOneLogo/:logoId', function(req, res, next) {
        console.log(req.params.logoId);
        var request = new sql.Request();
        //delete the logo from the Customer_Logos table that matches the Logo ID passed by the user through the My Logo's page delete button
        request.query( "DELETE FROM Customer_Logos WHERE logoID ='"+req.params.logoId+"'", function (err, result) {
            if (err) throw err;
            req.flash('message', 'Logo deleted!');
            res.redirect('/MyLogos');
        });
});

//this function creates and adds a logo to the My Logo's page
router.post('/createAndAddLogo', function(req, res, next) {
    //if there is a user logged in then run the following code
    if(req.user){
        //if the user didn't select a background color alert the user with a flash message
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

        //insert the logo into the Customer_Logos table of the database
        request.query("INSERT INTO Customer_Logos(logoId,customerId,dateCreated,logoName, filePath)VALUES (NEWID(), '"+req.user.customerId+"','"+date+"','" + logoName +'.png'+ "','" + 'static/assets/user_icons/' + "')", function (err, result) {
            //if there is an error then display the error to the user
            if (err) 
            {
                req.flash('message', 'Something went wrong with uploading.');
                res.redirect('/');
            }
            //grab the logo that was just recently added to the database
            request.query("SELECT logoId,logoName FROM Customer_Logos WHERE logoName =  '"+logoName+ '.png' +"'", function(err, results){
                if (err) throw err;

                /* turns the data url to an img format*/
                var dataURL = req.body.dataURL.replace(/^data:image\/\w+;base64,/, "");
                var buf = new Buffer(dataURL, 'base64');
                var logopath = 'public/assets/user_icons/' + results[0].logoId + results[0].logoName;
                /* writes the img to the server */
                fs.writeFile(logopath, buf);
            });
            //display successful message to the user
            req.flash('message', 'Uploaded new Logo!');
            res.redirect('/MyLogos');
        });
        //else the user is not logged in, display an error messsage
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
        if (err){
            req.flash('message', 'Unable to retrieve icons');
            return res.redirect('/');
        };

            request.query("SELECT filePath,bgName FROM Default_BgImages ", function (err, bgImages) {       
                if (err){
                    req.flash('message', 'Unable to retrieve background icons');
                    return res.redirect('/');
                };
                
                request.query("SELECT fontName FROM Default_Fonts ", function (err, fontNames) {
                    if (err){
                        req.flash('message', 'Unable to retrieve fonts');
                        return res.redirect('/');
                    };     
                    res.render('partials/canvaspartial', {results: results, bgImages: bgImages, req: req, fontNames: fontNames });
                });
            });//end query 1
        });//end query 2
    }//end if 3
    //else render the home page without the user variable
    else {
        req.flash('message', 'Must be logged in to create logo!');
        return res.redirect('/Login');
    }//end else
});

router.get('/MyLogos', function(req, res, next) { 
    if(req.user){
        
        var request = new sql.Request();
        request.query("SELECT logoName,logoID,customerId, dateCreated FROM Customer_Logos WHERE customerId = '"+req.user.customerId+"' ORDER BY dateCreated", function(err, results){
            if (err) throw err;
            for(i=0; i<results.length; i++){
                /* Date is trimmmed for reading purposes */
                var dateTrim = results[i].dateCreated;
                dateTrim = dateTrim + "";
                dateTrim = dateTrim.substring(4,15);
                results[i].dateCreated = dateTrim;
            }
            res.render('partials/logospartial', {sql: results, req: req});
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
