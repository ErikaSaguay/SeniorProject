var express = require('express');
var router = express.Router();
var sql = require('mssql');
var passwordHash = require('password-hash');

router.get('/home', function(req, res, next) {
    res.render('index');
});

router.post('/getAllLogos',function(req, res, next){
    var request = new sql.Request();
    request.query("SELECT fileName,logoID FROM Customer_Logos WHERE customerId = '"+req.body.id+"'", function(err, results){
        if(err)
            console.log("Problem getting user info function");
        for (var i = 0; i < results.length; i++) {

        }
    });
});

router.post('/logos', function(req, res, next) {
    
    var request = new sql.Request();
    
    var string = "INSERT INTO Customer_Logos(customerId,logoName,dateCreated)VALUES ?";
    
    var values = [req.body.logoName,req.body.customerId,Date.now()];
    
    request.query(string, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    });
});

router.post('/oneLogo', function(req, res, next) {
    var request = new sql.Request();
    request.query( "DELETE FROM Customer_Logos WHERE logoId ='"+req.body.id+"'", function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    });
});


module.exports = router;