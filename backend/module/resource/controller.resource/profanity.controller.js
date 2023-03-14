const Profanity = require('../model.resource/profanity.model');
const ProfanityHistory = require('../model.resource/history.profanity.modal');

const fs = require('fs');
const readXlsxFile = require('read-excel-file/node');

module.exports = {
  async getList(_, res) {
    await Profanity.aggregate([
      { $sort: { _id: -1 } },
      { $addFields: { id: '$_id' } },
      { $project: { _id: 0, id: 1, swear: 1, countryCode: 1, type: 1 } },
    ])
      .then((result) => res.json(result))
      .catch((e) => res.status(500).json(e));
  },
  async addToList(req, res) {
    const payload = req.body;
    if (!payload.length > 0) {
      return res.status(500).json('Must contain payload');
    }

    await Profanity.insertMany(payload)
      .then(async (result) => {
        const history = [];
        result.forEach(function (el) {
          history.push({
            oldWord: '',
            oldCountry: '',
            type: 'Added',
            swear: el.swear,
            newWord: el.swear,
            profanityId: el._id,
            newCountry: el.countryCode,
            countryCode: el.countryCode,
            adminId: payload[0].adminId,
            timestamp: payload[0].timestamp,
            internalId: payload[0].internalId,
          });
        });
        await ProfanityHistory.insertMany(history)
          .then(() => res.json(result))
          .catch((e) => res.status(500).json(e));
      })
      .catch((e) => {
        if (e.code === 11000) {
          const extDoc = e.writeErrors[0].err.op;
          res.status(500).json({
            error: `The word: ${extDoc.swear} and country: ${extDoc.countryCode} already exist.`,
          });
        } else {
          res.status(500).json(e);
        }
      });
  },
  async softDelete(req, res) {
    const payload = req.body;
    await Profanity.updateMany(
      { _id: payload.id },
      {
        $set: {
          type: 'Removed',
          updatedAt: payload.timestamp,
        },
      }
    )
      .then((result) => {
        Profanity.findOne({ _id: payload.id }).then((el) => {
          const historyDoc = new ProfanityHistory({
            newWord: '',
            newCountry: '',
            type: 'Removed',
            swear: el.swear,
            oldWord: el.swear,
            profanityId: el._id,
            oldCountry: el.countryCode,
            countryCode: el.countryCode,
            adminId: payload.adminId,
            internalId: payload.internalId,
            timestamp: payload.timestamp,
          });
          historyDoc
            .save()
            .then(() => res.json(result))
            .catch((e) => res.status(500).json(e));
        });
      })
      .catch((e) => res.status(500).json(e));
  },

  async history(_, res) {
    await ProfanityHistory.aggregate([
      { $sort: { _id: -1 } },
      { $addFields: { id: '$profanityId' } },
      { $project: { _id: 0, profanityId: 0 } },
    ])
      .then((result) => res.json(result))
      .catch((e) => res.status(500).json(e));
  },

  async updateList(req, res) {
    const payload = req.body;
    const modifyType = payload.modified;

    if (!modifyType)
      return res.status(500).json({ error: 'modify type required.' });

    try {
      const doc = await Profanity.findOne({ _id: payload.id });
      switch (modifyType) {
        case 'word':
          await Profanity.updateOne(
            { _id: payload.id },
            {
              type: 'Edited',
              swear: payload.newWord,
              updatedAt: payload.timestamp,
            }
          ).then((result) => {
            const history = new ProfanityHistory({
              type: 'Edited',
              profanityId: payload.id,
              swear: payload.newWord,
              oldWord: doc.swear,
              newWord: payload.newWord,
              countryCode: doc.countryCode,
              adminId: payload.adminId,
              internalId: payload.internalId,
              timestamp: payload.timestamp,
            });
            history
              .save()
              .then(() => res.json(result))
              .catch((e) => res.status(500).json({ error: e }));
          });
          break;
        case 'country':
          await Profanity.updateOne(
            { _id: payload.id },
            {
              type: 'Edited',
              countryCode: payload.newCountry,
              updatedAt: payload.timestamp,
            }
          ).then((result) => {
            const history = new ProfanityHistory({
              type: 'Edited',
              profanityId: payload.id,
              swear: doc.swear,
              countryCode: payload.newCountry,
              oldCountry: doc.countryCode,
              newCountry: payload.newCountry,
              adminId: payload.adminId,
              internalId: payload.internalId,
              timestamp: payload.timestamp,
            });
            history
              .save()
              .then(() => res.json(result))
              .catch((e) => res.status(500).json({ error: e }));
          });
          break;
        case 'both':
          await Profanity.updateOne(
            { _id: payload.id },
            {
              type: 'Edited',
              swear: payload.newWord,
              countryCode: payload.newCountry,
              updatedAt: payload.timestamp,
            }
          ).then(async (result) => {
            await ProfanityHistory.insertMany([
              {
                type: 'Edited',
                profanityId: payload.id,
                swear: payload.newWord,
                oldWord: doc.swear,
                newWord: payload.newWord,
                countryCode: doc.countryCode,
                adminId: payload.adminId,
                internalId: payload.internalId,
                timestamp: payload.timestamp,
              },
              {
                type: 'Edited',
                profanityId: payload.id,
                swear: payload.newWord,
                countryCode: payload.newCountry,
                oldCountry: doc.countryCode,
                newCountry: payload.newCountry,
                adminId: payload.adminId,
                internalId: payload.internalId,
                timestamp: payload.timestamp,
              },
            ])
              .then(() => res.json(result))
              .catch((e) => res.status(500).json({ error: e }));
          });
          break;
        default:
          res.status(500).json({ error: 'modify type required.' });
          break;
      }
    } catch (e) {
      if (e.code === 11000) {
        const extDoc = e.keyValue;
        res.status(500).json({
          error: `The word: ${extDoc.swear} and country: ${extDoc.countryCode} already exist.`,
        });
      } else {
        res.status(500).json(e);
      }
    }
  },
  addMultipleSwears: async function (req, res) {
    const filePath = 'uploads/' + req.file.filename;
    await readXlsxFile(filePath)
      .then(async (hosts) => {
        fs.unlinkSync(filePath);
        let HOSTS = hosts.slice(1);
        console.log('HOSTS knri', HOSTS);
        return res.json(HOSTS);
        if (!HOSTS.length)
          return res.json({ error: 'Uploaded file contains no data' });

        let failedUploads = [];
        let emailRegex =
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let phoneRegex = /^[0-9\+]{10,14}$/;

        for (const host of HOSTS) {
          if (host.length > 5) {
            host[4] = 'Invalid data format';
            failedUploads.push(host.slice(0, 5));
            continue;
          }
          if (host[0] == null) {
            host[4] = 'Invalid first name';
            failedUploads.push(host);
            continue;
          }
          if (host[1] == null) {
            host[4] = 'Invalid last name';
            failedUploads.push(host);
            continue;
          }
          if (!emailRegex.test(host[2])) {
            host[4] = 'Invalid email address';
            failedUploads.push(host);
            continue;
          }
          if (!phoneRegex.test(host[3])) {
            host[4] = 'Invalid phone number';
            failedUploads.push(host);
            continue;
          }
          let authUserparams = {
            status: 1,
            email: host[2],
            roleId: req.body.role,
            authAccessToken: uuidv4(),
            passwordHash: Math.random().toString(36).slice(2, 10),
          };
          let clientUserParams = {
            clientId: USER.clientId,
            createdBy: req.user.id,
            roleId: req.body.role,
          };
          let userProfileModelparams = {
            organization: req.body.organization,
            countryId: req.body.country,
            firstName: host[0],
            lastName: host[1],
            phone: host[3],
          };

          await authUserModel
            .add(authUserparams)
            .then((result) => {
              userProfileModelparams.userId = result.id;
              // Entry to client user
              clientUserParams.userId = result.id;
              clientUserModel
                .add(clientUserParams)
                .then((_) =>
                  // Entry to User profile
                  userProfileModel
                    .add(userProfileModelparams)
                    .then(async () =>
                      userLocations.split(',').forEach(
                        async (locationId) =>
                          await locationUserModel.add({
                            userId: userProfileModelparams.userId,
                            locationId,
                          })
                      )
                    )
                    .then(() => {
                      let payload = {
                        email: authUserparams.email,
                        firstName: userProfileModelparams.firstName,
                        lastName: userProfileModelparams.lastName,
                        activationUrl:
                          process.env.BASEURL +
                          'reset-password?token=' +
                          authUserparams.authAccessToken,
                        queueType: USER_ACCOUNT_ACTIVATION_EMAIL,
                      };

                      queueMessage.push(JSON.stringify(payload));
                    })
                    .catch((err) => console.log(err))
                    .catch((err) => console.log(err))
                )
                .catch((err) => console.log(err));
            })
            .catch((err) => {
              host[4] = err.errors[0].message;
              failedUploads.push(host);
            });
        }
        res.json({
          uploadSucceeded: HOSTS.length - failedUploads.length,
          totalCount: HOSTS.length,
          failedUploads,
        });
      })
      .catch((err) => {
        console.log(err);
        res.json(err);
      });
  },
};
