const express    = require("express");
const app        = express();
const connection = require("./mysqlConn");
const notifier   = require('node-notifier');
//console.log(path.join(__dirname, "./../javaFile"));

module.exports.register=function(req,res)
{
  
  var values = [[  
      orgName   = req.body.org_name,
      orgSector = req.body.org_sector,
      contactNo = req.body.contact,
      email     = req.body.email
      
    ]];
  console.log("Org name = "+orgName);

  password = req.body.password;

  connection.query("select email from orgInfo where email = ?", [email], function(err, results, method)
  {
    console.log(results[0]);
    if(results[0]==undefined)
    {
      var sql = "INSERT INTO orgInfo (orgName, orgSector, contactNo, email) VALUES ?"; 
    
      connection.query(sql, [values], function (err, result) {  
        if (err) throw err;  
        console.log("1 record inserted"); 
        // ! SELECT password, AES_DECRYPT(password,'passw') FROM orgInfo WHERE orgID=4;
        // ! var sql1 = "UPDATE orgInfo SET password = AES_ENCRYPT(?,'passw') WHERE email = ?";
        var sql1 = "UPDATE orgInfo SET password = AES_ENCRYPT(?,'passw') WHERE email = ?";
        connection.query( sql1, [password, email],  function(req1, err1, results) {
          //console.log(results[0].email);
          if (err) throw err;  
        console.log("Success");
        });

        //app.use(express.static(static_path));
        //res.sendFile(__dirname+ "/../index.html");
        //res.render('thankyou', {message : 'Thank you for your submission'});
        //res.end("Success");
        notifier.notify('Registered Successfully');
        res.render('sign_in');
        //res.sendFile(__dirname+ '/../alert.js');
        });
    }
    else if(results[0].email==email)
    {
      notifier.notify('Email already registered');
    }
  })

  
  

      
/*
    //connection.query('INSERT INTO users (orgName, orgSector, email, contactNo) VALUES ?',users, function (error, results, fields) {
      if (error) {
        res.json({
            status : false,
            message: 'there are some error with query'
        })
      }else{
          res.json({
            status : true,
            data   : results,
            message: 'user registered sucessfully'
            
        })
      }
      //res.status(201).render("index");
      
    });
*/

}
