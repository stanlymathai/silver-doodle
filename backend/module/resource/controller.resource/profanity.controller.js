const Profanity = require('../model.resource/profanity.model');

module.exports = {
  async getList(_, res) {
    await Profanity.find({})
      .then((result) => res.json(result))
      .catch((e) => res.error(e));
  },
  async addToList(req, res) {
    let payload = req.body;
    if (!payload.length > 0) {
      return res.status(500).json('Must contain payload');
    }

    await Profanity.insertMany(payload)
      .then((result) => res.json(result))
      .catch((e) => res.error(e));
  },
  async updateList(req, res) {
    let swearIds = req.body;
    await Profanity.updateMany(
      { _id: { $in: swearIds } },
      { $set: { type: 'Removed' } }
    )
      .then((result) => res.json(result))
      .catch((e) => res.error(e));
  },

  history(req, res) {},
  softDelete(req, res) {},
};
