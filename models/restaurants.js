var mongoose = require('mongoose');
var config = require('../config/database');
var restaurantSchema = mongoose.Schema({
  cityName:{
    type:String,
    required:String
  },
  restaurant:{
    type:Array,
    required:true
  }
});

var Restaurant  = module.exports = mongoose.model('Restaurant',restaurantSchema)
