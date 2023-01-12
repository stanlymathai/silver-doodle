const Reaction = require('../model.resource/reaction.model');

module.exports = {
  async handleReaction(req, res) {
    let payload = req.body.payload;

    switch (payload.action) {
      case 'ADD':
        const reaction = new Reaction({
          status: 'Active',
          userId: req.user.id,
          ref: payload.ref,
          type: payload.type,
          reaction: payload.event,
        });
        reaction
          .save()
          .then(() => res.json({ message: 'Success' }))
          .catch((e) => res.status(500).json({ error: e }));
        break;
      case 'REMOVE':
        await Reaction.findOneAndUpdate(
          { ref: payload.ref, status: 'Active', reaction: payload.event },
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
    let reportData = req.body.payload;
    res.json({ reportData });
  },
};
