const Profanity = require('../model.resource/profanity.model');
const ProfanityHistory = require('../model.resource/history.profanity.modal');

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
            timestamp: el.timestamp,
            newCountry: el.countryCode,
            countryCode: el.countryCode,
            adminId: payload[0].adminId,
            internalId: payload[0].internalId,
          });
        });
        await ProfanityHistory.insertMany(history)
          .then(() => res.json(result))
          .catch((e) => res.status(500).json(e));
      })
      .catch((e) => res.status(500).json(e));
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
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
