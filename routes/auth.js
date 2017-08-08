var express = require('express');
var router = express.Router();
var sql = require('mssql');
var passwordHash = require('password-hash');

router.post('/login',function(req,res,next){
    
    var request = new sql.Request();
    
    request.query("SELECT password FROM Customer WHERE username = '"+req.body.username+"' ", function(err, results){
        
        if(err)console.log(err);
        
        for (var i = 0; i < results.length; i++) {
           /*if(passwordHash.verify( req.body.password, results[i].password) === true){
               res.send("verified");
           }*/
            if(results[i].password===req.body.password){
                res.send("equals");
            }
           else{
               res.send("not equals")
           }
        }
    });
});
router.post('/signup',function (req,res,next){
    
    var hashedPassword = passwordHash.generate(req.body.password);
    
    console.log(hashedPassword);
    
    var request = new sql.Request();
    
    request.query("SELECT userName FROM Customer WHERE userName = '"+req.body.username+"'", function(err, results){
        
        if(err)console.log(err);
        
        if(results.length > 0){
            res.send( hashedPassword);
        }
        else{
            
            /*var insertUser = "INSERT INTO Customer(firstName,lastName,userName,password)VALUES ?";
    
            var values = [req.body.firstName,req.body.lastName,req.body.userName,hashedPassword];

            request.query(insertUser, [values], function (err, result) {
                if (err) throw err;
                console.log("Number of records inserted: " + result.affectedRows);
            });*/
        }
        
    });
});
router.get('/', function(req, res, next) {
    res.render('login');
});


module.exports = router;