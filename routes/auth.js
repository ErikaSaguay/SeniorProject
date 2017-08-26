var express = require('express');
var router = express.Router();
var sql = require('mssql');
var passwordHash = require('password-hash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var Sequelize = require('sequelize');
var flash = require('connect-flash'); 

var userAuth = false;

router.get('/', function(req, res, next) {  
    res.render('pages/login', {req:req});
});

 // used to serialize the user for the session
passport.serializeUser(function(user, done) {
    console.log("serializing" + " " + user.customerId);
    done(null, user.customerId);
});

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        console.log('deserializing' + " " + id);
        var request = new sql.Request();
        request.query("SELECT * FROM Customer WHERE customerId='"+ id +"'",function(err,results){
            //console.log(results[0]);
            done(err, results[0]);
        });
    });

// passport/login.js
passport.use('login', new LocalStrategy({
    usernameField : 'userName',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, user, password, done) { 
    // check the MSSQL Database to see if the user exists and if it does grab the password
    var request = new sql.Request();
    console.log(user);
    console.log(password);
        request.query("SELECT * FROM Customer WHERE userName = '"+ user +"' ", function(err, results){
            if(err)console.log(err);
            //console.log(results[0]);
            if(results.length <=0) {
                console.log("No User Found" + user + password);
                //req.flash('message', "No user with the username: " + username + " was found.");
                done(null, false);
            }
            
                if(passwordHash.verify(password, results[0].password) === true){
                    //store userId in the variable using the passport session
                    //req.flash('message', 'Successfully logged in!');
                    console.log('Successfully Logged In!');
                    //successfully logged in pass user object
                    //console.log(results[0].userName + results[0].password);
                    done(null, results[0]);
                    console.log(user.customerId);
                    var sessionID = user.customerId;
                    console.log("This is the sessionID: " + sessionID);
                }
                else{
                    
                    console.log('Invalid Password!');
                    //req.flash('message', 'Invalid Password');
                    done(null, false);
                }
        });//end query request
}));//end passport local login

passport.use('signup', new LocalStrategy({
    usernameField : 'signUsername',
    passwordField : 'signPassword',
    passReqToCallback : true
  },
  function(req, username, password, done){

   // find a user in MSSQL with provided username
      
    var request = new sql.Request();
    console.log(username);
    console.log(password);
    request.query("SELECT * FROM Customer WHERE userName = '"+ username +"' ", function(err, results){
        if(err){
              console.log('Error in Saving user: '+err);  
              throw err;  
        }      
        else if(results.length > 0){
            console.log('User already exists');
            done(null, false);
        }
        else{
            console.log('trying to create user..' + ' ' + username);
            //create hashed password for secure password saving in the database
            var hashedPassword = passwordHash.generate(password);
            //if there is no user with that username then allow them to create a new user
            request.query("INSERT INTO Customer(firstName,lastName,userName,password)VALUES('"+req.body.firstName+"','"+req.body.lastName+"','"+req.body.signUsername+"','"+hashedPassword.toString()+"')" , function(err, result) {
                if (err) throw err;
                
                console.log('User Registration succesful: ' + username);    
                
            });
            
            //get all the new information on the user we just created and put it into the done function for use later.
            request.query("SELECT * FROM Customer WHERE userName = '"+ username +"' ", function(err, users){
                console.log("successfully added: " + users[0]);    
                userAuth = true;
                return done(null, users[0]);
            });
            

        }
    });
    

    
  }));

//uses passport login strategy once login form is submitted
router.post('/login', passport.authenticate("login", { successRedirect: "/", failureRedirect: "/auth" }));

//uses passport singup strategy once signup form is submitted
router.post('/signup', passport.authenticate("signup", { successRedirect: "/", failureRedirect: "/auth" }));

/* Handle Logout */
router.post('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
