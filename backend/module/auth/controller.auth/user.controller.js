const User = require('../model.auth/user.model');

const users = (_, res) => {
  User.find()
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        allUsers: docs.map((doc) => {
          return {
            id: doc._id,
            name: doc.name,
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        status: 500,
        error: err,
      });
    });
};

const getUser = (req, res) => {
  User.find({ _id: req.params.userId })
    .exec()
    .then((doc) => {
      doc = doc[0];
      const response = {
        id: doc._id,
        name: doc.name,
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        status: 500,
        error: err,
      });
    });
};

module.exports = {
  getUser: getUser,
  users: users,
};
