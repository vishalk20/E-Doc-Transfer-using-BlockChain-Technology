const express    = require("express");
const app        = express();
const connection = require("./mysqlConn");
const notifier   = require("node-notifier");
const alert      = require('alert');
const session = require("express-session");


module.exports.authenticate = function(req, res)
{ 
    //console.log(req.session.Username);
    //console.log("Password = "+req.body.email);
    const email=req.body.email;
    const password=req.body.password;
  
    //create table temp as SELECT email, AES_DECRYPT(password,'passw') as password from orgInfo where email = "vishal150299.vk@gmail.com"

    var sql2 = "create table temp as SELECT email, AES_DECRYPT(password,'passw') as password from orgInfo where email = ?";

    connection.query(sql2, [email], function (error, results2, fields) {
      if (error) 
      {
        //console.log(error);
      }
      else
      {
        //console.log("successfully Decrypt");
        //console.log(results2[0]);
      }
    });

    // ! SELECT password, AES_DECRYPT(password,'passw') FROM orgInfo WHERE orgID=4;
    var sql = "SELECT o.orgID,o.email,t.password FROM orgInfo o,temp t WHERE o.email = ? and o.email=t.email";

    connection.query(sql, [email], function (error, results, fields) {
      if (error) 
      {
        notifier.notify("there are some error with query");
      }
      else
      {
        //console.log(results[0]);
        if(results.length >0)
        {
            if(password==results[0].password)
            {
              req.session.Username=email;
              req.session.orgid=results[0].orgID;
              req.session.flag=true;
              if(req.session.Username)
              //console.log("**********Login Session = "+req.session.Username);
              notifier.notify("Login Successfully");
              //alert("Login Successfully");
              //res.redirect("./../digilocker_login_page.html");
              
              //res.render('view_customer_documents', { title: 'User List', userData: null});
              res.redirect('/userLogin');
              //res.redirect("./../digilocker_login_page.html");
            }
            else
            {
              //notifier.notify("Email and password does not match");
              alert("Email and password does not match");
            }
        }
        else
        {
            //notifier.notify("Email does not exits");
            alert('Danger! Email does not exits');
        }
      }
      
    });

    connection.query("DROP TABLE temp", function (error, fields) {
      if (error) 
      {
        //console.log(error);
      }
      else
      {
        //console.log("successfully Deleted");
      }
    });
}