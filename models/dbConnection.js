var express = require('express');
var app = express();
var sql = require("mssql");

var config =  {
    user: 'SE425_Group3',
    password: 'password1',
    server: 'sql.neit.edu', 
    database: 'SE425_Group3',
    port: 4500
};
sql.connect(config, function(err) {
    if (err) throw err;
    else
            console.log("connected");
});

module.exports = sql;




