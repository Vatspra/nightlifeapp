var express = require('express');
var mongoose = require('mongoose');
var bodyParser=require('body-parser');
var  bcrypt = require('bcrypt');
var path = require('path');

var passport =require('passport');
var config = require('./config/database');
var cors = require('cors');
var users = require('./users/users');
var app = express();

mongoose.connect(config.database,function(err){
if(err){
  console.log(error);
}
  console.log("connected to mongodb")
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
//app.use(cors());


app.use(passport.initialize());
app.use(passport.session());
require('./config/passsport')(passport);


//app.use(express.static(path.join(__dirname, 'public')));
app.get('/',(req,res)=>{
  res.render('index')
})
app.use('/users',users);



app.listen('3000',function(){
  console.log("listening at port 3000")


})
