const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../model/userModel');

const authenticate = async (payload) => {
  return new Promise((resolve, reject) => {
    User.find({
      userId: payload.userId,
      email: payload.email,
    })
      .lean()
      .exec()
      .then(function (dbUser) {
        if (!dbUser) reject({ message: 'Unauthorized' });
        if (dbUser) resolve(dbUser);
      })
      .catch((e) => reject(e));
  });
};
const main = async (req, res) => {
  await User.find({
    userId: req.body.user_id,
    email: req.body.user_email,
  })
    .lean()
    .exec()
    .then((userObj) => {
      if (userObj.length) {
        onboardUser({ userObj, ...req }, res);
      } else registerUser(req, res);
    })
    .catch((err) => res.status(500).json({ error: err }));
};

const registerUser = async (req, res) => {
  const userParams = {
    userId: req.body.user_id,
    email: req.body.user_email,
    authAccessToken: uuidv4(),
  };
  const user = new User(userParams);
  await user
    .save()
    .then((userObj) => onboardUser({ userObj, ...req }, res))
    .catch((err) => res.status(500).json({ error: err }));
};

const onboardUser = (req, res) => {
  const payload = { id: req.userObj.userId };
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
module.exports = { index: main, authenticate };
