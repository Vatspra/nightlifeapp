
const express = require('express');
//var bodyParser =require('body-parser')
var config = require('../config/database')

//var app= express();
const router = express.Router();
var User = require('../models/user');
var Restaurant = require('../models/restaurants');
var passport = require('passport');
var jwt = require('jsonwebtoken');


//var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.post('/register',function(req,res,next){
  console.log(req.body.name);
    User.findOne({email:req.body.email},function(err,user){
     if(err){
       console.log(err);
     }
     if(user){
       res.json({success:false,msg:"this email is already registered"});
     }
     else{
       var newUser = new User({
         name:req.body.name,
         email:req.body.email,
         password:req.body.password,
         username:req.body.username
       });
       User.addUser(newUser,function(err,user){
        if(err){
          res.json({success:false,msg:"failed to register"});
           }
        else{
          res.json({success:true,msg:"new user created"});
          }
        })
     }

    })

 })

router.post('/authenticate',function(req,res,next){
  var username = req.body.email;
  var password = req.body.password;
  //console.log('user name is '+email);

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
    console.log(token)
    res.json({success:true,
              token:'Bearer '+token,
               user:{
                 id:user._id,
                 name:user.name,
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


router.post('/addrestaurant',function(req,res,next){
  var city = req.body.city;
  var restaurants = req.body.restaurant;
  //find if city name already exists in the db;
 Restaurant.findOne({cityName:city},function(err,rest){
    if(err){
      console.log(err)
    }

    if(rest){
      console.log("this city already exists")
      res.json(rest);
    }
    else{
      console.log("this city is not exists")
      //this city is not in our database save this to database
       new Restaurant({cityName:city,restaurant:restaurants}).save(function(err,rest){
        if(err){
          console.log(err)
        }
        else{
          console.log("hi")
          console.log('data is saved',rest)
           res.json(rest);
        }
      })
    }
  })
})

router.post('/updaterestaurant',function(req,res){
  var city = req.body.city;
  var restaurants = req.body.restaurant;
  console.log('hi',city);

  Restaurant.findOneAndUpdate({cityName: city}, {$set:{restaurant:restaurants}}, {new: true}, function(err, rest){
      if(err){
          console.log("Something wrong when updating data!");
      }

      console.log("updated");
      console.log(rest.cityName)
      res.json(rest);
  });
});

/*router.get('/hello',function(req,res){
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
