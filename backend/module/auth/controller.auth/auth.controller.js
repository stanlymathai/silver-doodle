const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../model.auth/user.model');

const index = (_, res) =>
  res.status(404).json({ message: 'MoniTalks Comment-session API Server' });

const authenticate = async (payload) =>
  new Promise((resolve, reject) =>
    User.findOne(
      {
        userId: payload.id,
        email: payload.email,
      },
      { _id: 0, userId: 1 }
    )
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
  User.findOne(
    {
      userId: req.body.user_id,
      email: req.body.user_email,
    },
    { userId: 1, _id: 0, email: 1 }
  )
    .lean()
    .exec()
    .then((userObj) => {
      if (!!userObj) {
        onboardUser({ userObj, ...req }, res);
      } else registerUser(req, res);
    })
    .catch((err) => res.status(500).json({ error: err }));
};

const registerUser = (req, res) => {
  const userParams = {
    userId: req.body.user_id,
    email: req.body.user_email,
    authAccessToken: uuidv4(),
  };
  const user = new User(userParams);
  user
    .save()
    .then((userObj) => onboardUser({ userObj, ...req }, res))
    .catch((err) => res.status(500).json({ error: err }));
};

const onboardUser = (req, res) => {
  const payload = {
    id: req.userObj.userId,
    email: req.userObj.email,
  };
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
