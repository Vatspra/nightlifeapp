
const express = require('express');
//var bodyParser =require('body-parser')
var config = require('../config/database')

//var app= express();
const router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var jwt = require('jsonwebtoken');


//var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.post('/register',function(req,res,next){
  console.log(req.body.name);

  var newUser = new User({
    name:req.body.username,
    email:req.body.email,
    username:req.body.username,
    password:req.body.password
  });


  User.addUser(newUser,function(err,user){
   if(err){
     res.json({success:false,msg:"failed to register"});
      }
   else{
     res.json({success:true,msg:"new user created"});
     }
   })
 })


router.post('/authenticate',function(req,res,next){

  var username = req.body.username;
  var password = req.body.password;
  console.log('user name is '+username);


  User.getUserByUsername(username,function(err,user){
  if(err) throw err;

  if(!user){
    return res.json({success:false,msg:'user not found'})
  }
  User.comparePassword(password,user.password,function(err,isMatch){
  if(err) throw err;
  if(isMatch){
console.log('yes matched');
    const token = jwt.sign(user.toJSON(),config.secret,{
      expiresIn :604800
    });
    res.json({success:true,
              token:'JWT '+token,
               user:{
                 id:user._id,
                 name:user.name,
                 username:user.username,
                 email:user.email
               }
             })
          }
    else{
    return res.json({success:false,msg:'wrong password'})

  }

  })

  })

 })

router.get('/profile',passport.authenticate('jwt', { session: false }),function(req,res,next){
 res.json({msg:"you are authenticated user",
   user:req.user});
 });

router.get('/applicationDetail',passport.authenticate('jwt', { session: false }),function(req,res,next){
  res.json({
    user:req.user,
    msg:"successfull"
  });


})
router.get('/hello',function(req,res){
  res.json({msg:"hello"});
})
 /*router.get('/validation',function(req,res,next){
 res.send("validation");
 })
/*function hi(req,res,next){

  console.log(req.body);
  next();
}*/

module.exports = router;
