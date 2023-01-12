// import passport and passport-jwt modules
const passport = require('passport');
const passportJWT = require('passport-jwt');

const authController = require('../auth/controller.auth/auth.controller');

// ExtractJwt to help extract the token
let ExtractJwt = passportJWT.ExtractJwt;

// JwtStrategy which is the strategy for the authentication
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = Buffer.from(process.env.AUTHENTICATION_KEY).toString(
  'base64'
);

// lets create our strategy for web token
let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, done) {
  authController
    .authenticate(jwt_payload)
    .then((result) => done(null, result))
    .catch((err) => done(err, false));
});
// use the strategy
passport.use(strategy);

module.exports = passport;
