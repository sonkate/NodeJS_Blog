const passport = require('passport');
const TwitterStrategy = require('passport-twitter');
require('dotenv').config();

passport.use(new TwitterStrategy({
    consumerKey: process.env.API_KEY,
    consumerSecret: process.env.API_KEY_SECRET,
    callbackURL: `${process.env.URL}/auth/twitter/callback`,
    passReqToCallback: true
  },
  function(req, token, tokenSecret, profile, cb) {
    console.log('token: ', token);
    console.log('tokenSecret: ', tokenSecret);
    var user = {
      token: token,
      tokenSecret: tokenSecret,
      id: profile.id
    }
    return cb(null, user);
  }
));

passport.serializeUser(function(user, callback, ) {
    callback(null, user);
})

passport.deserializeUser(function(obj, callback) {
    callback(null, obj);
})