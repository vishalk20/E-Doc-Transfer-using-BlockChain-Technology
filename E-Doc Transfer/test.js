//alert("Call Successfull");
const express = require("express");
const path    = require("path");
const app     = express();
const conn    = require("./db/mysqlConn");
const alert      = require('alert');
//var registerController=require('./controllers/register-controller');
const registerController        = require("./db/register-controller");
const authenticateController    = require("./db/authenticate-controller");
const adharAuth                 = require("./db/adharAuth");
const viewDoc                   = require("./db/viewDoc");
const shareDocToOrg             = require("./db/shareDocToOrg");
const session                   = require('express-session')
//const Login = require("./demo_db_connection");

const port        = process.env.PORT || 3001;
const static_path = path.join(__dirname, "./")

app.set('view engine', 'ejs'); 

var uid=1;
//console.log(path.join(__dirname, "/public"));

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))
session.logoutFlag=true;
/* app.get("/", (req, res) => {
    req.session.logoutFlag=true;
    console.log("This is logoutFlag session = "+req.session.ud);
    res.render("index");
}); */

app.get("/sign_in", (req, res) => {
    console.log("This is sign in session = "+req.session.Username)
    console.log("This is logoutFlag session = "+session.logoutFlag);
      req.session.destroy(function(err) {
        // cannot access session here
      })  /* 
      if(req.session==undefined)
      req.session.logoutFlag=true; */
      //console.log("This is sign in session after destroy = "+req.session.Username)
    res.render("sign_in");
});

app.get("/userLogin", (req, res) => {
    if(req.session.Username!=undefined)
        res.render("view_customer_documents");
    else res.render('sign_in');
});

app.get("/adhar_Auth_logout", (req, res) => {
    req.session.adharUsername=undefined;
    req.session.flag=false;
    console.log("This is adhar logout session = "+req.session.Username)
    /* req.session.destroy(function(err) {
        // cannot access session here
      }) */
      //console.log("This is sign in session after destroy = "+req.session.Username)
      
    if(req.session.Username!=undefined)
    {
        res.render("view_customer_documents");
    }
    else res.render('sign_in');
});

app.get("/logout", (req, res) => {

    req.session.adharUsername=undefined;
    req.session.Username=undefined;
    req.session.logoutFlag=false;

    session.logoutFlag=false;
      req.session.destroy(function(err) {
        // cannot access session here
      }) 
      //console.log("This is sign in session after destroy = "+req.session.Username)
    res.redirect("sign_in");
});

/* 
app.get("/adharAuth/sign_in", (req, res) => {
    console.log("This is sign in session = "+req.session.Username)
    req.session.destroy(function(err) {
        // cannot access session here
      })
      //console.log("This is sign in session after destroy = "+req.session.Username)
    res.render("view_customer_documents");
});
 */
/* app.get("/viewImage/:SrNo:databaseID", (req, res) => {
    var SrNo,databaseID;
    console.log(req.params.SrNo+" "+req.params.databaseID);
    //app.get("/db/viewDoc",viewDoc.js);
    //res.render("/db/viewDoc", { title: 'User id', SrNo: req.params.SrNo, databaseID: req.params.databaseID});
}); */

app.get("/viewImage/:databaseID:SrNo",viewDoc.view);

app.get("/viewUpDoc/:databaseID:SrNo",viewDoc.viewUpDoc);

app.post("/sharedDoc/:orgID/:tableName/:adhar",shareDocToOrg.sharedDoc);


app.get("/digilocker_login_page", (req, res) => {      
    if(req.session.Username!=undefined)
    {
    	res.render("digilocker_login_page");
    }
    else res.redirect('/sign_in');
}); 

app.get("/org_view_page", (req,res) => {
    res.render("org_view_doc");
})

/* app.get("/view_customer_doc", (req,res) => {
    res.render("view_customer_documents");
}) */

app.post("/register", async(req, res) =>{
    try {
        
        //console.log(req.body.org_name);
        //res.send(req.body.org_name);
        
        //console.log(req.body.org_sector);
        res.send(req.body.email);

        //res.render("Login");
    } catch (error) {
        res.status(400).send(error);
    }
})

app.post("/httpPostRequest", (req, res) => {
    alert("successfully call http request");
    res.send("Welcome");
});

app.post("/authenticate-control", (req, res) => {
    res.render("/authenticate-controller");
});
app.post("/register-controller",registerController.register);
app.post("/authenticate-controller",authenticateController.authenticate);
app.post("/adharAuth",adharAuth.auth);
app.get("/adharAuth1",adharAuth.auth1);
app.get("/adharAuth2",adharAuth.auth2);

app.listen(port, () => {
    console.log(`Server is running at port no ${port}`);
})





//sql, req.body.org_name, req.body.org_sector, req.body.contact, req.body.email, req.body.password,
