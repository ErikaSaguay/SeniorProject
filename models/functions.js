
var express = require('express');
var app = express();
var conn = require("mssql");
var passwordHash = require('password-hash');
var router = express.Router();

//login and signup 
router.post('/login', function (userName, password){
    
    var message;
    conn.query("SELECT password FROM Customer WHERE username = '"+userName+"' ", function(err, results){
        if(err)
            console.log("Problem with user login function");
        for (var i = 0; i < results.length; i++) {
           if(passwordHash.verify( password, results.password) === true){
               //send user to index page
           }
           else{
               message = "Incorrect username/password";
           }
        }
    });
    
    app.get('/', function(req, res) {


        res.render('views/login',{
            message:message
        });
    });
});
router.post('/signup',function (req,res){
    
    var firstName = req.body.firstname;
    var lastName = req.body.lastname;
    var userName = req.body.username;
    var passWord = req.body.password;
    
    var hashedPassword = passwordHash.generate(passWord);
    
    
    conn.query("SELECT userName FROM Customer WHERE username = '"+userName+"'", function(err, results){
        if(err)
            console.log("Problem with user signup function");
        if(results.length > 0){
            message = "username is taken";
        }
        else{
            var insertUser = "INSERT INTO Customers(firstName,lastName,username,password)VALUES ?";
    
            var values = [firstName,lastName,userName,hashedPassword];

            conn.query(insertUser, [values], function (err, result) {
                if (err) throw err;
                console.log("Number of records inserted: " + result.affectedRows);
            });
        }
        
    });
});




//Default Data
router.get('/defaultData',function(){
    var query = "SELECT filePath FROM Default_Icons";
});
//Default Images
router.get('/defaultImages',function(){
    var query = "SELECT filePath FROM Default_Images";
});


//Logos Page
router.get('/getAllLogos',function(_id){
    conn.query("SELECT fileName,logoID FROM Customer_Logos WHERE customerId = '"+_id+"'", function(err, results){
        if(err)
            console.log("Problem getting user info function");
        for (var i = 0; i < results.length; i++) {

        }
    });
});
function selectOneLogo(_id){

    conn.query("SELECT fileName FROM Customer_Logos WHERE logoId =  '"+_id+"'", function(err, results){
        if(err)
            console.log("Problem getting single logo function");
        for (var i = 0; i < results.length; i++) {

        }
    });
}


//Create Page
function insertLogo(logoName,customerId){
    
    var query = "INSERT INTO Customer_Logos(customerId,logoName,dateCreated)VALUES ?";
    
    var values = [logoName,customerId,Date.now()];
    
    conn.query(query, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    });
}
function deleteLogo(_id){

    conn.query( "DELETE FROM Customer_Logos WHERE logoId ='"+_id+"'", function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    });
}


