const express = require("express");
const path    = require("path");
const app     = express();
const connection = require("./mysqlConn");

const Meme =  require('../build/contracts/Meme.json');
const Web3 = require("web3");
const web3 = new Web3('HTTP://127.0.0.1:7545');
//const Window = require('window');
//const window = new Window();


const ipfsClient = require('ipfs-http-client');
//const ipfs = ipfsClient();    
//		OR     
const ipfs = ipfsClient('/ip4/127.0.0.1/tcp/5001')

const fs = require('fs');

app.set('view engine', 'ejs'); 
const alert      = require('alert');
const { table } = require("console");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

var tableName;
var adhar_Mo_No;
var orgID;
var ckBox;

var hash;
const loadIPFS = async(img) => {
  console.log(typeof(img));
  console.log(img);
    const filesAdded = await ipfs.add(img);
    console.log(filesAdded);
    hash = filesAdded.cid;
    console.log(filesAdded.cid);
    loadBlockchainData();
    return filesAdded;
  //return filesAdded[0];
};

async function loadBlockchainData()
{
  const networkId = await web3.eth.net.getId()
  console.log("This is web3 = "+networkId);
  const networkData = Meme.networks[networkId];
	console.log("net address = "+networkData.address);
  const ganacheAccounts = await web3.eth.getAccounts();
  console.log(ganacheAccounts);
  const contract = new web3.eth.Contract(Meme.abi, networkData.address);
  const memeHash = await contract.methods.get().call()
  //console.log("MemeHash = "+memeHash);
  await contract.methods.set(hash).send({ from: ganacheAccounts[0] }).then((r) => {
    alert("Successfull");
  })
}

module.exports.sharedDoc = function(req, res)
{
  if(req.session.Username!=undefined)
  {
    adhar_Mo_No = req.params.adhar;
    orgID = req.params.orgID;
    tableName = req.params.tableName;
    ckBox = req.body.k;

    console.log("Check box "+req.body.k+" is clicked");
    console.log("Table name = "+req.params.tableName+"\nAdhar/Mo No = "+req.params.adhar+"\norg id = "+req.params.orgID);
    console.log("This is Shared Doc Module");
    if(tableName=='digiDoc')
    {
      var sql1='SELECT * FROM digiDoc d1,digiDatabase d2 WHERE (d2.moNo = ? or d2.adharNo = ?) and d1.ID=d2.ID';
      connection.query(sql1, [adhar_Mo_No,adhar_Mo_No], function (err, data, fields) {
        if (err) throw err;
        //console.log(data);
        
        if(ckBox!=undefined)
        {
          alert("Document Shared Successfully ");

          for (let index = 0; index < ckBox.length; index++) {
          //console.log(ckBox[index]-1);
          console.log(data[ckBox[index]-1].docName);
          const buf = Buffer.from(data[ckBox[index]-1].docImage);
          console.log("Doc Data ####\n"+data[ckBox[index]-1].docImage.length);
          

          //const file = fs.readFileSync(data[ckBox[index]-1].docImage);
          console.log("Uploading to ipfs");
          /* ipfs.add(data[ckBox[index]-1].docImage, (error, result) => {
            console.log('Ipfs result', result)
            if(error) {
              console.error(error)
              return
            }
          }) */
          console.log(loadIPFS(data[ckBox[index]-1].docImage));
          




          var sql = "INSERT INTO orgStoredDoc VALUES(?,?,?,?)"

          connection.query(sql,[orgID,data[ckBox[index]-1].ID,data[ckBox[index]-1].docName,data[ckBox[index]-1].docImage], function (err, data) {
            if (err) throw err;

            //alert("Document Shared Successfully");
          });

          }
        }
        else
        {
          alert("No document's to share");
        }

      });
    }
    else if(tableName=='digiUpDoc')
    {
      var sql1='SELECT * FROM digiUpDoc d1,digiDatabase d2 WHERE (d2.moNo = ? or d2.adharNo = ?) and d1.ID=d2.ID';
      connection.query(sql1, [adhar_Mo_No,adhar_Mo_No], function (err, data, fields) {
        if (err) throw err;
        //console.log(data[0].docName);

        if(ckBox!=undefined)
        {
          for (let index = 0; index < ckBox.length; index++) {
          //console.log(ckBox[index]-1);
          console.log(data[ckBox[index]-1].docName);

            var sql = "INSERT INTO orgStoredDoc VALUES(?,?,?,?)"

            connection.query(sql,[orgID,data[ckBox[index]-1].ID,data[ckBox[index]-1].docName,data[ckBox[index]-1].docImage], function (err, data) {
              if (err) throw err;

              alert("Document Shared Successfully");
            });

          }
        }
        else
        {
          alert("No document's to share");
        }

      });
    }
  /* 
    connection.query(sql,[req.params.databaseID], function (err, data) {
      if (err) throw err;
      data[i].docImage = new Buffer(data[i].docImage).toString('base64');
      console.log("This is data 0 id = "+data[0].ID);
      //console.log("This is data 0 ID = "+data);
      res.render("viewDoc", { title: 'User id', data: data[i]});
    }); */
    //res.redirect('./../../digilocker_login_page.html');
    //res.render('digi_doc_page', { title: 'User List', userData: digiDocPage,adhar_Mo_No});
    if(req.params.tableName=='digiDoc')
    {
      res.redirect('./../../../adharAuth2');
    }
    else if(req.params.tableName=='digiUpDoc')
    {
      res.redirect('./../../../adharAuth1');
    } 
  }
  else res.render('sign_in');
}