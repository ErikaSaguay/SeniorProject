var express = require('express');
var router = express.Router();
var sql = require('mssql');
var passwordHash = require('password-hash');

router.post('/login',function(req,res,next){
    
    var request = new sql.Request();
    
    request.query("SELECT password FROM Customer WHERE username = '"+req.body.username+"' ", function(err, results){
        
        if(err)console.log(err);
        
       
           if(passwordHash.verify( req.body.password, results[i].password) === true){
               res.send("verified");
           }
           else{
               res.send("not equals")
           }
        
    });
});
router.post('/signup',function (req,res,next){

    var request = new sql.Request();
    
    request.query("SELECT userName FROM Customer WHERE userName = '"+req.body.username+"'", function(err, results){
        
        if(err)console.log(err);
        
        if(results.length > 0){
            res.send("Username is taken");
        }
        else{
            var hashedPassword = passwordHash.generate(req.body.password);
            request.query("INSERT INTO Customer(firstName,lastName,userName,password)VALUES('"+req.body.firstName+"','"+req.body.lastName+"','"+req.body.userName+"','"+hashedPassword+"')" , function (err, result) {
                if (err) throw err;
                console.log("You have signed up");
            });
        }
        
    });
});
router.get('/', function(req, res, next) {
    res.render('login');
});


module.exports = router;
