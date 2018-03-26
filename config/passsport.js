var User = require('../models/user');

var config = require('../config/database');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = function(passport){

    var opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = config.secret;
    console.log(opts);

    //console.log(req.body);
    //opts.issuer = 'accounts.examplesoft.com';
    //opts.audience = 'yoursite.net';
    passport.use('jwt',new JwtStrategy(opts,function(jwt_payload, done){
      console.log(jwt_payload);
      console.log(jwt_payload._id)
        User.getUserById(jwt_payload._id, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
              console.log("yes");
                return done(null, user);
            } else {
                return done(null, false);
                // or you could create a new account
            }
        });
    }));
}
