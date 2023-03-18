const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../model.auth/user.model');

const index = (_, res) =>
  res.status(404).json({ message: 'MoniTalks Comment-session API Server' });

const authenticate = async (secretOrKey) => {
  return new Promise((resolve, reject) =>
    User.findOne({ secretOrKey }, { _id: 1 })
      .lean()
      .exec()
      .then((dbUser) => {
        if (!!dbUser) {
          resolve(dbUser);
        } else reject({ message: 'unauthorized' });
      })
      .catch((e) => reject(e))
  );
};

const registerUser = async (res, userData) => {
  const user = new User(userData);
  await user
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

const main = async (req, res) => {
  const userParams = {
    userId: req.body.payload.userId,
    email: req.body.payload.userEmail,
    internalId: req.body.payload.internalId,
  };
  await User.findOne(userParams)
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
          status: 'ACTIVE',
          ...userParams,
        };
        registerUser(res, userData);
      }
    })
    .catch((err) => res.status(500).json({ error: err }));
};

module.exports = { index, main, authenticate };
