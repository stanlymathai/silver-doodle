const Report = require('../model.resource/report.model');
const Reaction = require('../model.resource/reaction.model');

module.exports = {
  async handleReaction(req, res) {
    let payload = req.body.payload;

    switch (payload.action) {
      case 'ADD':
        const reaction = new Reaction({
          status: 'Active',
          ref: payload.ref,
          type: payload.type,
          reaction: payload.event,
          userId: req.user.userId,
        });
        reaction
          .save()
          .then(() => res.json({ message: 'Success' }))
          .catch((e) => res.status(500).json({ error: e }));
        break;
      case 'REMOVE':
        await Reaction.findOneAndUpdate(
          {
            reaction: payload.event,
            ref: payload.ref,
            status: 'Active',
          },
          { status: 'Removed' }
        )
          .then(() => res.json({ message: 'Success' }))
          .catch((e) => res.status(500).json({ error: e }));
        break;
      default:
        res.status(500).json({ error: 'error' });
        break;
    }
  },
  reportComment(req, res) {
    let payload = req.body.payload;
    const report = new Report({
      reportedUser: req.user.userId,
      reason: payload.reason,
      ref: payload.ref,
    });
    report
      .save()
      .then(() => res.json({ message: 'Success' }))
      .catch((e) => res.status(500).json({ error: e }));
  },
};
