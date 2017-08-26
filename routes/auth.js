var express = require('express');
var router = express.Router();
var sql = require('mssql');
var passwordHash = require('password-hash');
var session = require('express-session');
var flash = require('connect-flash-plus');


router.get('/', function(req, res, next) {
  res.render('pages/login');
});

router.post('/login',function(req,res,next){
    var request = new sql.Request();
    
    request.query("SELECT password FROM Customer WHERE userName = '"+req.body.userName+"' ", function(err, results){

        if(err)console.log(err);

        if(passwordHash.verify(req.body.password, results[0].password) === true){

          console.log("right");
          req.flash('info', 'Welcome ' + req.body.username);
          res.redirect('/');
        }
        else{
          console.log("wrong");
          res.redirect('/auth');
        }
        
    });
});

router.post('/signup',function(req,res,next){
    console.log("hellO");
    var request = new sql.Request();
    console.log(req.body.username);
    request.query("SELECT userName FROM Customer WHERE userName = '"+req.body.userName+"' ", function(err, results){
        
        if(err)console.log(err);
        console.log(results.length);
        if(results.length > 0){
            res.send("Username is taken");
        }
        else{
          console.log(req.body.password);
            var hashedPassword = passwordHash.generate(req.body.password);
            request.query("INSERT INTO Customer(firstName,lastName,userName,password)VALUES('"+req.body.firstName+"','"+req.body.lastName+"','"+req.body.userName+"','"+hashedPassword.toString()+"')" , function(err, result) {
                if (err) throw err;
                console.log("You have signed up");
                res.redirect("auth/login");
            });
        }
    });
});


module.exports = router;
