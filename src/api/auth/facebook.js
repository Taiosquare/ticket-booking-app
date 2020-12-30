const passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    { User } = require('../models/User');

require("dotenv").config();

passport.use(new FacebookStrategy({
    clientID: PROCESS.ENV.FACEBOOK_APP_ID,
    clientSecret: PROCESS.ENV.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    User.findOrCreate({name: profile.displayName}, {name: profile.displayName,userid: profile.id}, function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }
));

module.exports = passport;