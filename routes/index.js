var express = require('express');
var router = express.Router();
var sql = require('mssql');

//flash messages
var session = require('express-session');
var flash = require('connect-flash-plus');

var path = require('path');
var fs = require('file-system');
var os = require('os');

router.post('/getAllLogos',function(req, res, next){
    
    var request = new sql.Request();
    
    request.query("SELECT fileName,logoID FROM Customer_Logos WHERE customerId = '"+req.body.id+"'", function(err, results){
        if(err)
            console.log("Problem getting user info function");
        for (var i = 0; i < results.length; i++) {
            res.render(results[i].logoID);
        }
    });
});
router.post('/getOneLogo', function(req, res, next) {

    sql.query("SELECT fileName FROM Customer_Logos WHERE logoId =  '"+req.body.id+"'", function(err, results){
        if(err)
            console.log("Problem getting single logo function");
        for (var i = 0; i < results.length; i++) {

        }
    });
}); 
router.post('/insertLogo', function(req, res, next) {
    
    var request = new sql.Request();
    
    request.query("INSERT INTO Customer_Logos(customerId,logoName,dateCreated)VALUES ('"+req.body.logoName+"','"+req.body.customerId+"','"+Date.now()+"')", function (err, result) {
        if (err) throw err;
        console.log("Logo was inserted");
        //should show how many rows were effected;
    });
});

router.post('/removeOneLogo', function(req, res, next) {
    var request = new sql.Request();
    request.query( "DELETE FROM Customer_Logos WHERE logoId ='"+req.body.id+"'", function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    });
});

<<<<<<< HEAD
router.post('/createAndAddLogo', function(req, res, next) {
    var dataURL = req.body.dataURL.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer(dataURL, 'base64');
    fs.writeFile('public/assets/image.png', buf);
     res.render('pages/index', {messages: "file uploaded!"});
});

router.get('/', function(req, res, next) {
    console.log("index page");
    res.render('pages/index', { messages: req.flash('info') });
});

router.get('/login', function(req, res, next) {
    console.log("login page");
    res.render('pages/login');
});
module.exports = router;
