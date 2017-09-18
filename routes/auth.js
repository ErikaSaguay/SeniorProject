var express = require('express');
var router = express.Router();
var sql = require('mssql');
var passwordHash = require('password-hash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var Sequelize = require('sequelize');

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
        //select all from customer where the username equals the username given by the user
        request.query("SELECT * FROM Customer WHERE userName = '"+ user +"' ", function(err, results){
            if(err)console.log(err);
            //if there is no user found in the database then alert the user with a flash message
            if(results.length <=0) {
                console.log("No User Found" + user + password);
                req.flash('message', "No user with the username: " + user + " was found.");
                done(null, false);
            }
                //else if the password matches the one in the database then succesfully log the user in
                else if(passwordHash.verify(password, results[0].password) === true){
                    console.log('Successfully Logged In!');
                    done(null, results[0]);
                }
                //else if the password doesn't match then display the error message to the user
                else{
                    console.log('Invalid Password!');
                    req.flash('message', 'Invalid Password');
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
    //select all from customer where the username given by the user matches one found in the database
    request.query("SELECT * FROM Customer WHERE userName = '"+ username +"' ", function(err, results){
        //if there is an error display the error to the user
        if(err){
            req.flash('message', "Error when saving the user.");
              console.log('Error in Saving user: '+err);  
              throw err;  
        }      
        //else if there is already a user with that username in the database then alert the user
        else if(results.length > 0){
            console.log('User already exists');
            req.flash('message', "No user with the username: " + username + " was found.");
            done(null, false);
        }
        //else if the first password entered doens't match the second then display the error to the user
        else if(req.body.signPassword2 != password){
            console.log("The passwords you typed didn't match, please try again");
            req.flash('message', "The passwords you typed didn't match please try again!");
            done(null, false);
        }
        //else if there is no user with the same username and the passwords match then create the user and add them to the Customer table in the database
        else{
            console.log('trying to create user..' + ' ' + username);
            //create hashed password for secure password saving in the database
            var hashedPassword = passwordHash.generate(password);
            //if there is no user with that username then allow them to create a new user
            request.query("INSERT INTO Customer(firstName,lastName,userName,password)VALUES('"+req.body.firstName+"','"+req.body.lastName+"','"+req.body.signUsername+"','"+hashedPassword.toString()+"')" , function(err, result) {
                if (err) throw err;
                req.flash('message', "User Registration successful: " + username);
            
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
router.post('/login', passport.authenticate("login", { successRedirect: "/", failureRedirect: "/Login" }));

//uses passport singup strategy once signup form is submitted
router.post('/signup', passport.authenticate("signup", { successRedirect: "/", failureRedirect: "/Login" }));


module.exports = router;
