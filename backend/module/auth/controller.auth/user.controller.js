const User = require('../model.auth/user.model');
const jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt');

const userSignUp = (req, res) => {
  User.find({ name: req.body.name })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          status: 409,
          message: 'Email exists',
        });
      } else {
        bcrypt.genSalt(parseInt(process.env.JWT_KEY), (err, salt) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          }
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) {
              return res.status(500).json({
                error: err,
              });
            } else {
              const user = new User({
                name: req.body.name,
                password: hash,
              });
              user
                .save()
                .then((result) => {
                  const token = jwt.sign(
                    {
                      name: result.name,
                    },
                    process.env.JWT_KEY,
                    { expiresIn: '1h' }
                  );
                  res.status(201).json({
                    message: 'User created',
                    id: user._id,
                    name: user.name,
                    token: token,
                    status: 200,
                  });
                })
                .catch((err) => {
                  return res.status(500).json({
                    error: err,
                  });
                });
            }
          });
        });
      }
    });
};

const userLogIn = (req, res) => {
  User.findOne({ name: req.body.name })
    .exec()
    .then((user) => {
      bcrypt
        .compare(req.body.password, user.password)
        .then((resp) => {
          const token = jwt.sign(
            {
              name: user.name,
            },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
          );
          if (resp) {
            return res.status(200).json({
              status: 200,
              messsage: 'Auth succ',
              id: user._id,
              name: user.name,
              token: token,
            });
          } else {
            return res.status(401).json({
              status: 401,
              message: 'Auth failed',
            });
          }
        })
        .catch((err) => {
          if (err) {
            return res.status(401).json({
              status: 401,
              message: 'Auth failed',
            });
          }
        });
    })
    .catch((err) => {
      return res.status(500).json({
        status: 500,
        error: err,
      });
    });
};

const users = (req, res) => {
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
  userSignUp: userSignUp,
  userLogIn: userLogIn,
  getUser: getUser,
  users: users,
};
