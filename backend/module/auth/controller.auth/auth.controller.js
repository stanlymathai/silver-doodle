const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../model.auth/user.model');
const UserLog = require('../model.auth/log.user.model.js');

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

const registerUser = (res, userData) => {
  const user = new User(userData);
  const userLog = new UserLog({ userId: userData.userId });

  try {
    user
      .save()
      .then((userObj) => userLog.save().then(() => onboardUser(res, userObj)));
  } catch (error) {
    res.status(500).json({ error });
  }
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

const userOverview = (req, res) => {
  const userId = req.params.id;
  if (!userId) return res.status(400).json({ message: 'userId is required' });

  User.aggregate([
    { $match: { userId } },
    { $limit: 1 },
    { $project: { _id: 0, userId: 1, status: 1 } },
    {
      $lookup: {
        from: 'userlogs',
        pipeline: [{ $limit: 1 }, { $project: { _id: 0, userId: 0 } }],
        localField: 'userId',
        foreignField: 'userId',
        as: 'userLog',
      },
    },
    { $unwind: '$userLog' },
    {
      $lookup: {
        from: 'reports',
        pipeline: [{ $project: { _id: 1, reason: 1 } }],
        localField: 'userId',
        foreignField: 'reportedUser',
        as: 'reported',
      },
    },
  ])
    .then((result) => res.status(200).json(result[0]))
    .catch((e) => {
      console.log(e, 'userOverview');
      res.status(500).json(e);
    });
};

const banUser = async (req, res) => {
  const payload = req.body;
  console.log(payload);
  if (!payload.userId)
    return res.status(400).json({ message: 'userId is required' });
  if (!payload.banReason)
    return res.status(400).json({ message: 'reason is required' });

  try {
    await UserLog.updateOne(
      { userId: payload.userId },
      {
        $push: {
          bans: {
            banUntil: payload.banUntil,
            bannedBy: payload.bannedBy,
            banReason: payload.banReason,
            banStarts: payload.banStarts,
          },
        },
      }
    );
    if (payload.intlyStatus) {
      await User.updateOne(
        { userId: payload.userId },
        {
          $set: {
            status: payload.status ? 'BANNED' : 'ACTIVE',
          },
        }
      );
    }
    res.status(200).json({ message: 'success' });
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = { index, main, authenticate, banUser, userOverview };
