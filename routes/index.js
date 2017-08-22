var express = require('express');
var router = express.Router();
var sql = require('mssql');
var session = require('express-session');
var dateFormat = require('dateformat');


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

router.get('/', function(req, res, next) {
    
   var obj = {};
   
   var request = new sql.Request();
   
   request.query("SELECT logoName,logoID FROM Customer_Logos WHERE customerId = '1053C78E-FCFD-46EF-8C9C-78A889196098'", function(err, results){
        if (err) throw err;
        obj = {sql: results};
        console.log(obj);
        res.render('pages/index',{sql: results});
        
    });
     
});

module.exports = router;

