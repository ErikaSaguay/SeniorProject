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

router.post('/getOneLogo', function(req, res, next) {
    var request = new sql.Request();
    request.query("SELECT filePath FROM Customer_Logos WHERE logoID =  '"+req.body.pictureId+"'", function(err, results){
        if (err) throw err;
        console.log(results[0].filePath);
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

router.post('/removeOneLogo', function(req, res, next) {
    var request = new sql.Request();
    request.query( "DELETE FROM Customer_Logos WHERE logoID ='"+req.body.pictureId+"'", function (err, result) {
        if (err) throw err;
        console.log("logo removed");
    });
});

router.post('/createAndAddLogo', function(req, res, next) {
    var dataURL = req.body.dataURL.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer(dataURL, 'base64');
    fs.writeFile('public/assets/image.png', buf);
    res.render('partials/logospartial');
});

router.get('/', function(req, res, next) {

    res.render('partials/homepartial');

});

router.get('/Help', function(req, res, next) {
    
    res.render('partials/helppartial');
 
});

router.get('/CreateLogo', function(req, res, next) {
    
    res.render('partials/canvaspartial');
 
});

router.get('/MyLogos', function(req, res, next) {
    
    res.render('partials/logospartial');
 
});
module.exports = router;