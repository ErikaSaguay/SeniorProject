var express = require('express');
var router = express.Router();
var sql = require('mssql');


router.get('/defaultData',function(req,res,next){
    
    var request = new sql.Request();
    
    request.query("SELECT filePath FROM Default_Icons", function (err, recordset) {       
        if (err) console.log(err);
         res.send(recordset);  
    });
    
});
//Default Images
router.get('/defaultImages',function(req,res,next){
    
    var request = new sql.Request();
    
    request.query("SELECT filePath FROM Default_Images", function (err, recordset) {       
        if (err) console.log(err);
         res.send(recordset);  
    });
    
});
module.exports = router;