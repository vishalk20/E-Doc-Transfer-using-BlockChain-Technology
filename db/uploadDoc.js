const express = require("express");
const path    = require("path");
const app     = express();
const connection = require("./mysqlConn");
const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient('/ip4/127.0.0.1/tcp/5001');
const fs = require('fs');
const session = require("express-session");



app.set('view engine', 'ejs'); 
const alert      = require('alert');

const { table } = require("console");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

module.exports.uploadDoc = function(req, res)
{
    var adharNo = req.body.adhar;
    var filename = req.body.filename;
    var orgID = req.session.orgid;

    const loadIPFS = async(img) => {
        //console.log(typeof(img));
        console.log(req.file);
        //var buffer = new Buffer(fs.readFileSync(req.file.buffer));
          const filesAdded = await ipfs.add(req.file.buffer);
          console.log(filesAdded);
          hash = filesAdded.path;
          console.log("File Hash = "+filesAdded.path);
      
      
          var sql1='SELECT docImage FROM `orgStoredDoc` where docImage=? and orgID=?';
      
          connection.query(sql1,[hash,orgID], function (err, data) {
            console.log("This is ipfs check = "+data[0]);
            if(data[0] == undefined)
            {
                console.log("StoreHash Function Called");
              
                //console.log("********ckBox[temp]-1  = "+ckBox[temp])
                var sql = "INSERT INTO orgStoredDoc VALUES(?,?,?,?)"

                connection.query(sql,[orgID,adharNo,filename,hash], function (err, data) {
                    if (err) throw err;
                    
                    alert("Document Upload Successfully");
                    res.render("view_customer_documents", { title: 'User List', userData: null});
                });
              
            }
            else
            {
              console.log("Document already Shared");
              alert("Document already Shared");
              res.render("view_customer_documents", { title: 'User List', userData: null});
            }
        
            //alert("Document Shared Successfully");
          });
      
          //return filesAdded;
        //return filesAdded[0];
      };


    
    loadIPFS(req.file);
}