const express    = require("express");
const app        = express();
const connection = require("./mysqlConn");
const notifier   = require("node-notifier");
const alert      = require('alert');

app.use(express.json());
app.use(express.urlencoded({extended:false}));

var adhar_Mo_No;
var security_pin;
var orgID;

module.exports.auth = function(req, res)
{

  console.log("**********Auth Session********** = "+req.session.Username);
  if(req.session.flag==true)
  {
    adhar_Mo_No = req.body.adhar;
    security_pin = req.body.security_pin;
    orgID = req.session.orgid;
    
    //const adhar = req.body.adhar;
    var temp = 12345;
    console.log("*************************\n"+req.session.Username);
    console.log(adhar_Mo_No+" successfully Called Adhar Auth\nORG ID = "+req.params.orgID);
    //res.redirect("./../digilocker_login_page.html");

    var sql = "SELECT * FROM `digiDatabase` WHERE (moNo = ? or adharNo = ?) and securityPin = ?";

    connection.query(sql, [adhar_Mo_No,adhar_Mo_No,security_pin], function (error, results2, fields) {
        if (results2[0]==undefined) 
        {
          alert("Entered data is incorrect");
          console.log("Not a DigiLocker User");
          //res.redirect("./../digilocker_login_page.html");
          //res.render('digilocker_login_page');
        }
        else
        {
          //notifier.notify("successfully auth adhar");
          console.log("successfully auth adhar");
          req.session.adharUsername=adhar_Mo_No;
          console.log(results2[0]); 
          var sql1='SELECT * FROM digiDoc d1,digiDatabase d2 WHERE (d2.moNo = ? or d2.adharNo = ?) and d1.ID=d2.ID';
          connection.query(sql1, [adhar_Mo_No,adhar_Mo_No], function (err, data, fields) {
            if (err) throw err;
            console.log("This is Image data"+data[0].docName);
            for(i=0;i<data.length;i++)
            {
              data[i].docImage = new Buffer(data[i].docImage).toString('base64');
            }
            
            //console.log("This is Adhar Auth Image file =  "+data[0].docImage);
            // This is for calling/routing to the ejs file
            res.render('digi_doc_page', { title: 'User List', userData: data,adhar_Mo_No,orgID}); 
            });
          //res.redirect("./../digi_doc_page");
        }
      });
  }
  else if(req.session.Username==undefined)
  {
    res.render('sign_in');
  }
  else res.render('view_customer_documents');
}

module.exports.auth2 = function(req, res)
{
  if(req.session.adharUsername!=undefined)
  {
    console.log(adhar_Mo_No+"This is digiDoc module");
    //res.render('digi_doc_page'); 
    var sql1='SELECT * FROM digiDoc d1,digiDatabase d2 WHERE (d2.moNo = ? or d2.adharNo = ?) and d1.ID=d2.ID';
          connection.query(sql1, [adhar_Mo_No,adhar_Mo_No], function (err, data, fields) {
            if (err) throw err;
            //console.log("This is Image data\n"+data[0].docName);
            for(i=0;i<data.length;i++)
            {
              data[i].docImage = new Buffer(data[i].docImage).toString('base64');
            }
            //console.log("This is Adhar Auth Image file =  "+data[0].docImage);
            // This is for calling/routing to the ejs file
            res.render('digi_doc_page', { title: 'User List', userData: data,adhar_Mo_No,orgID}); 
            });
  }
  else if(req.session.Username==undefined)
  {
    res.render('sign_in');
  }
  else res.render('view_customer_documents');
}

module.exports.auth1 = function(req, res)
{
  if(req.session.adharUsername!=undefined)
  {
    console.log(adhar_Mo_No+"This is digiUpDoc module");
    //res.render('digi_doc_page'); 
    var sql1='SELECT * FROM digiUpDoc d1,digiDatabase d2 WHERE (d2.moNo = ? or d2.adharNo = ?) and d1.ID=d2.ID';
          connection.query(sql1, [adhar_Mo_No,adhar_Mo_No], function (err, data, fields) {
            if (err) throw err;
            //console.log("This is Image data"+data[1].docName);
            console.log(data.length);
            for(i=0;i<data.length;i++)
            {
              data[i].docImage = new Buffer(data[i].docImage).toString('base64');
            }
            //console.log("This is Adhar Auth Image file =  "+data[0].docImage);
            // This is for calling/routing to the ejs file
            res.render('digi_up_doc_page', { title: 'User List', userData: data,adhar_Mo_No,orgID}); 
            });
  }
  else if(req.session.Username==undefined)
  {
    res.render('sign_in');
  }
  else res.render('view_customer_documents');
}