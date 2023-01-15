const passport = require('passport');
const passportJWT = require('passport-jwt');

const authController = require('../auth/controller.auth/auth.controller');

// ExtractJwt to help extract the token
const ExtractJwt = passportJWT.ExtractJwt;

// strategy for the authentication
const JwtStrategy = passportJWT.Strategy;
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: Buffer.from(process.env.AUTHENTICATION_KEY).toString('base64'),
};

// strategy for web token
const strategy = new JwtStrategy(
  jwtOptions,
  async (payload, done) =>
    await authController
      .authenticate(payload.secretOrKey)
      .then(() => done(null, true))
      .catch((err) => done(err, false))
);
// use the strategy
passport.use(strategy);

module.exports = passport;
