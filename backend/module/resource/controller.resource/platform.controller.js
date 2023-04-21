const PLATFORM = require('../model.resource/platform.model');

module.exports = {
  async getPlatformList(_, res) {
    await PLATFORM.aggregate([
      { $match: { status: 'Active' } },
      { $sort: { _id: -1 } },
      { $addFields: { id: '$_id' } },
      { $project: { _id: 0, status: 0 } },
    ])
      .then((result) => res.json(result))
      .catch((e) => res.status(500).json(e));
  },

  async addPlatform(req, res) {
    const payload = req.body;

    const platform = new PLATFORM({
      name: payload.name,
      code: payload.code,
      description: payload.description,
      resourceUrl: payload.resourceUrl,
      timeStamp: payload.timeStamp,
    });
    platform
      .save()
      .then((result) => res.json(result))
      .catch((e) => res.status(500).json({ error: e }));
  },

  async updatePlatform(req, res) {
    const payload = req.body.payload;

    await PLATFORM.updateOne({ _id: payload.id }, payload)
      .then((result) => res.json(result))
      .catch((e) => res.status(500).json({ error: e }));
  },

  async softDelete(req, res) {
    const payload = req.body;
    await Profanity.updateOne(
      { _id: payload.id },
      { $set: { status: 'Disabled' } }
    )
      .then((result) => res.json(result))
      .catch((e) => res.status(500).json(e));
  },
};
