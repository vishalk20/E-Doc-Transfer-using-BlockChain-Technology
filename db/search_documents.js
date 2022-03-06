const express    = require("express");
const app        = express();
const connection = require("./mysqlConn");
const notifier   = require('node-notifier');

module.exports.search=function(req,res)
{
    if(req.session.Username!=undefined)
    {
        adharno = req.body.adharno;
        console.log("Adhar No = "+adharno);
        console.log("OrgID = "+req.session.orgid);
        id=req.session.orgid;

        connection.query("select * from orgStoredDoc where orgID = ? and adharNo = ?", [id,adharno], function(err, data, method)
        {
            if(data[0]!=undefined)
            {
                    res.render("view_customer_documents", { title: 'User List', userData: data});
                
            }
            else res.render("view_customer_documents", { title: 'User List', userData: null});
        })
    }
    else res.render('sign_in');
}