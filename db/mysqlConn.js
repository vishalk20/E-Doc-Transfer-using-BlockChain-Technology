var mysql = require('mysql');

var con = mysql.createConnection({
  host    : "localhost",
  user    : "root",
  password: "",
  database: "vish"
});

con.connect(function(err) 
{
  if(!err) 
  {
    console.log("Database is connected");
  } 
  else 
  {
    console.log("Error while connecting with database");
  }
/*
  var sql = "CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });*/
});

module.exports = con;




