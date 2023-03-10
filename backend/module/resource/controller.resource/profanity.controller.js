const Profanity = require('../model.resource/profanity.model');

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
    let payload = req.body;
    if (!payload.length > 0) {
      return res.status(500).json('Must contain payload');
    }

    await Profanity.insertMany(payload)
      .then((result) => res.json(result))
      .catch((e) => res.status(500).json(e));
  },
  async softDelete(req, res) {
    let swearIds = req.body;
    await Profanity.updateMany(
      { _id: { $in: swearIds } },
      { $set: { type: 'Removed' } }
    )
      .then((result) => res.json(result))
      .catch((e) => res.status(500).json(e));
  },

  async history(_, res) {
    await Profanity.aggregate([
      { $sort: { _id: -1 } },
      { $addFields: { id: '$_id' } },
      { $project: { _id: 0 } },
    ])
      .then((result) => res.json(result))
      .catch((e) => res.status(500).json(e));
  },

  async updateList(req, res) {
    let payload = req.body;
    if (payload.newWord) payload.swear = payload.newWord;
    if (payload.newCountry) payload.countryCode = payload.newCountry;

    const profanityId = payload.id;
    await Profanity.updateOne(
      { _id: profanityId },
      { type: 'Edited', ...payload }
    )
      .then((result) => res.json(result))
      .catch((e) => res.status(500).json(e));
  },
};
