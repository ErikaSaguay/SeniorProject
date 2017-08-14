var express = require('express');
var router = express.Router();
var sql = require('mssql');
var passwordHash = require('password-hash');


router.get('/', function(req, res, next) {
  
    res.render('pages/login');
});

router.post('/login',function(req,res,next){

    var request = new sql.Request();
    
    request.query("SELECT password FROM Customer WHERE username = '"+req.body.username+"' ", function(err, results){
        
        console.log(req.body.password);
        console.log(results.password);

        if(err)console.log(err);
       
           if(passwordHash.verify(req.body.password, results[0].password) === true){
               res.redirect('/');
           }
           else{
               res.send("not equals")
           }
        
    });
});
router.post('/signup',function(req,res,next){
    console.log("hellO");
    var request = new sql.Request();
    console.log(req.body.username);
    request.query("SELECT userName FROM Customer WHERE userName = '"+req.body.username+"' ", function(err, results){
        
        if(err)console.log(err);
        console.log(results.length);
        if(results.length > 0){
            res.send("Username is taken");
        }
        else{
          console.log(req.body.password);
            var hashedPassword = passwordHash.generate(req.body.password);
            request.query("INSERT INTO Customer(firstName,lastName,userName,password)VALUES('"+req.body.firstName+"','"+req.body.lastName+"','"+req.body.username+"','"+hashedPassword.toString()+"')" , function(err, result) {
                if (err) throw err;
                console.log("You have signed up");
            });
        }
        
    });
});


module.exports = router;
