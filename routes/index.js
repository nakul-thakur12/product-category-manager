var express = require('express');
var router = express.Router();
const db = require('../model/dbConfig');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{username: ''});
});

router.get("/login",(request,response)=>{
  response.render('login',{username: ''});
});

router.post('/login',(req,res)=>{
    var username = req.body.username;
    var password = req.body.password;
     
    var obj ={'username':username,'password':password}

    db.collection('admin').findOne(obj,(err,result)=>{
        if(!err)
        {
          if(result.length != 0)
          {
            console.log("Hello...."+JSON.stringify(result));
             var uname = result.username;
             console.log("Username is : "+uname)
             req.session.current_user = uname;
             req.session.save();
             res.redirect('/admin')
          }
          else
          {
            console.log("Bye...");
          }
        }
        else
        {
          console.log("Hiiii...");
        }
    });
  })


module.exports = router;
