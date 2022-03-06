const express = require("express");
const path    = require("path");
const app     = express();
const connection = require("./mysqlConn");
app.set('view engine', 'ejs'); 

app.use(express.json());
app.use(express.urlencoded({extended:false}));

/* app.get("/viewImage/:SrNo:databaseID", (req, res) => {
    var SrNo,databaseID;
    //console.log(req.params.SrNo+" "+req.params.databaseID);
    res.render("demo", { title: 'User id', SrNo: req.params.SrNo, databaseID: req.params.databaseID});
});
 */

module.exports.view = function(req, res)
{
  if(req.session.adharUsername!=undefined)
  {
    //console.log("JS Route Module");
    //console.log("SrNo = "+req.params.SrNo+" UserID = "+req.params.databaseID);
    var i=req.params.SrNo-1;
    //console.log("i = "+(i-1));
    var sql = "SELECT * FROM digiDoc where ID=?";
    connection.query(sql,[req.params.databaseID], function (err, data) {
      if (err) throw err;
      data[i].docImage = new Buffer(data[i].docImage).toString('base64');
      //console.log("This is data 0 id = "+data[0].ID);
      ////console.log("This is data 0 ID = "+data);
      res.render("viewDoc", { title: 'User id', data: data[i]});
    });

  }
  else if(req.session.Username==undefined)
  {
    res.render('sign_in');
  }
  else 
  {
    res.render('close_tab'); //res.redirect('./../userLogin');
  }


    
}

module.exports.viewUpDoc = function(req, res)
{
  if(req.session.adharUsername!=undefined)
  {
    //console.log("This is View Uploaded Doc Module");
    //console.log("SrNo = "+req.params.SrNo+" UserID = "+req.params.databaseID);
    var i=req.params.SrNo-1;
    //console.log("i = "+(i-1));
    var sql = "SELECT * FROM digiUpDoc where ID=?";
    connection.query(sql,[req.params.databaseID], function (err, data) {
      if (err) throw err;
      data[i].docImage = new Buffer(data[i].docImage).toString('base64');
      //console.log("This is data 0 id = "+data[0].ID);
      ////console.log("This is data 0 ID = "+data);
      res.render("viewDoc", { title: 'User id', data: data[i]});
    });
  }
  else if(req.session.Username==undefined)
  {
    res.render('sign_in');
  }
  else res.render('close_tab'); //res.redirect('./../userLogin');
}