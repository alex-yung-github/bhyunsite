//GOOGLE ITEMS FOR OAUTH LOGIN
const passport =require("passport")
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const google_client_id = "646826979350-s86c17h1jo5u5j4n89lhq249vkk52ckd.apps.googleusercontent.com"
const google_client_secret = "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"
const google_redirect_url = "127.0.0.1:8080/verified_page"
const google_callback = "http://localhost:8080/google/callback"

passport.serializeUser(function(user, done){
    done(null, user);
})

passport.deserializeUser(function(user, done){
    done(null, user)
})

passport.use(new GoogleStrategy({
  clientID:google_client_id,
  clientSecret:google_client_secret,
  callbackURL: google_callback,
  passReqToCallback   : true
},
function(request, accessToken, refreshToken, profile, done) {
      return done(null, profile);
}
));