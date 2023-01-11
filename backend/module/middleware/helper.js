const passport = require('passport');
const jwt = require('jsonwebtoken');

module.exports = {
  verifyAuthentication: function (req, res, next) {
    passport.authenticate('jwt', function (err, user, info) {
      try {
        let isTokenExpired = 0;
        const payload = payloadFromRefreshToken(req.headers.refreshtoken);

        if (info && info.name == 'TokenExpiredError') {
          isTokenExpired = 1;
          const token = jwt.sign(
            payload,
            Buffer.from(process.env.AUTHENTICATION_KEY).toString('base64')
          );
          req.headers.authorization = 'Bearer ' + token;
          res.setHeader('token', 'Bearer ' + token);
          res.setHeader('isTokenExpired', isTokenExpired);
          req.user = { id: payload.id };
          next();
        } else if (!err && user) {
          req.user = { id: payload.id };
          next();
        } else if (!user || err) {
          res.status(401);
          res.end();
          return;
        }
      } catch (err) {
        if (err) next(err);
        res.status(401);
        res.end();
        return;
      }
    })(req, res, next);
  },
  payloadFromRefreshToken: payloadFromRefreshToken,
};

function payloadFromRefreshToken(token) {
  return jwt.verify(
    token,
    Buffer.from(process.env.REFRESH_TOKEN_KEY).toString('base64'),
    function (_, payload) {
      if (payload) {
        delete payload.iat;
        delete payload.exp;
        return payload;
      }
    }
  );
}
