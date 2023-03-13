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
      { $sort: { timestamp: -1 } },
      { $addFields: { id: '$profanityId' } },
      { $project: { _id: 0, profanityId: 0 } },
    ])
      .then((result) => res.json(result))
      .catch((e) => res.status(500).json(e));
  },

  async updateList(req, res) {
    let payload = req.body;
    payload.type = 'Edited';
    if (payload.newWord) payload.swear = payload.newWord;
    if (payload.newCountry) payload.countryCode = payload.newCountry;

    const profanityId = payload.id;
    await Profanity.findOne({ _id: profanityId })
      .then(async (doc) => {
        await Profanity.updateOne({ _id: profanityId }, { ...payload })
          .then((result) => {
            const history = new ProfanityHistory({
              ...payload,
              profanityId,
              timestamp: payload.updatedAt,
              ...(!payload.swear && { swear: doc.swear }),
              ...(!payload.oldWord && { oldWord: doc.swear }),
              ...(!payload.oldCountry && { oldCountry: doc.countryCode }),
              ...(!payload.countryCode && { countryCode: doc.countryCode }),
            });
            history
              .save()
              .then(() => res.json(result))
              .catch((e) => res.status(500).json(e));
          })
          .catch((e) => res.status(500).json(e));
      })
      .catch((e) => res.status(500).json(e));
  },
};
