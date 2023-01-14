const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../model.auth/user.model');

const index = (_, res) =>
  res.status(404).json({ message: 'MoniTalks Comment-session API Server' });

const authenticate = (payload) =>
  new Promise((resolve, reject) =>
    User.findOne({ secretOrKey: payload.token }, { _id: 0, userId: 1 })
      .lean()
      .exec()
      .then((dbUser) => {
        if (!!dbUser) {
          resolve(dbUser);
        } else reject({ message: 'unauthorized' });
      })
      .catch((e) => reject(e))
  );

const main = (req, res) => {
  const userParams = {
    status: 'ACTIVE',
    userId: req.body.payload.user_id,
    email: req.body.payload.user_email,
  };
  User.findOne(userParams)
    .lean()
    .exec()
    .then((userObj) => {
      if (!!userObj) {
        onboardUser(res, userObj);
      } else {
        const userData = {
          fullName: req.body.payload.fullName,
          avatarUrl: req.body.payload.avatar,
          secretOrKey: uuidv4(),
          ...userParams,
        };
        registerUser(res, userData);
      }
    })
    .catch((err) => res.status(500).json({ error: err }));
};

const registerUser = (res, userData) => {
  const user = new User(userData);
  user
    .save()
    .then((userObj) => onboardUser(res, userObj))
    .catch((err) => res.status(500).json({ error: err }));
};

const onboardUser = (res, userObj) => {
  const payload = { secretOrKey: userObj.secretOrKey };
  const token = jwt.sign(
    payload,
    Buffer.from(process.env.AUTHENTICATION_KEY).toString('base64'),
    { expiresIn: '30m' }
  );
  const refreshToken = jwt.sign(
    payload,
    Buffer.from(process.env.REFRESH_TOKEN_KEY).toString('base64'),
    { expiresIn: '1y' }
  );
  res.json({ token: 'Bearer ' + token, refreshToken });
};
module.exports = { index, main, authenticate };
