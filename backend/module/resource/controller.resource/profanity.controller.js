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
      .then((result) => {
        const historyDocs = [];
        result.forEach(function (el) {
          historyDocs.push({
            oldWord: '',
            oldCountry: '',
            swear: el.swear,
            newWord: el.swear,
            adminId: el.adminId,
            profanityId: el._id,
            newCountry: el.countryCode,
            countryCode: el.countryCode,
            timeStamp: el.timeStamp,
            updatedAt: el.updatedAt,
          });
        });
        ProfanityHistory.insertMany(historyDocs);
        res.json(result);
      })
      .catch((e) => res.status(500).json(e));
  },
  async softDelete(req, res) {
    const swearIds = req.body;
    const updatedAt = Date.now();
    await Profanity.updateMany(
      { _id: { $in: swearIds } },
      {
        $set: {
          type: 'Removed',
          updatedAt: updatedAt,
        },
      }
    )
      .then((result) => {
        Profanity.find({ _id: { $in: swearIds } }).then((docs) => {
          const historyDocs = [];
          docs.forEach(function (el) {
            historyDocs.push({
              newWord: '',
              newCountry: '',
              type: 'Removed',
              swear: el.swear,
              adminId: el.adminId,
              profanityId: el._id,
              oldWord: el.swear,
              oldCountry: el.countryCode,
              countryCode: el.countryCode,
              timeStamp: el.timeStamp,
              updatedAt: updatedAt,
            });
          });
          ProfanityHistory.insertMany(historyDocs);
        });
        res.json(result);
      })
      .catch((e) => res.status(500).json(e));
  },

  async history(_, res) {
    await ProfanityHistory.aggregate([
      { $sort: { updatedAt: -1 } },
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
    if (!payload.updatedAt) payload.updatedAt = Date.now();

    const profanityId = payload.id;
    await Profanity.findOne({ _id: profanityId })
      .then(async (doc) => {
        await Profanity.updateOne({ _id: profanityId }, { ...payload })
          .then(() => {
            const history = new ProfanityHistory({
              profanityId,
              ...payload,
              ...(!payload.swear && { swear: doc.swear }),
              ...(!payload.oldWord && { swear: doc.swear }),
              ...(!payload.oldCountry && { swear: doc.countryCode }),
              ...(!payload.countryCode && { countryCode: doc.countryCode }),
            });
            history.save().then((result) => res.json(result));
          })
          .catch((e) => res.status(500).json(e));
      })
      .catch((e) => res.status(500).json(e));
  },
};
