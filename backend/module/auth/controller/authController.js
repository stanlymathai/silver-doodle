const { v4: uuidv4 } = require('uuid');
const User = require('../model/userModel');

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
  let userParams = {
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
  console.log(req.userObj, 'yes user');
  res.json({ user: req.userObj });
};
module.exports = { index: main };
