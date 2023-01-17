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
          userId: payload.userId,
          reaction: payload.event,
          timeStamp: payload.timeStamp,
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
      timeStamp: payload.timeStamp,
      reportedUser: payload.userId,
      reason: payload.reason,
      ref: payload.ref,
    });
    report
      .save()
      .then(() => res.json({ message: 'Success' }))
      .catch((e) => res.status(500).json({ error: e }));
  },
  async getUserReaction(req, res) {
    const userId = req.params.userId;
    if (userId) {
      const articleReactions = await Reaction.aggregate([
        { $match: { userId, status: 'Active', type: 'ARTICLE' } },
        {
          $lookup: {
            from: 'articles',
            pipeline: [
              { $limit: 1 },
              { $project: { publishedAt: 0, timeStamp: 0, _id: 0 } },
            ],
            localField: 'ref',
            foreignField: 'articleId',
            as: 'article',
          },
        },
        { $project: { status: 0, userId: 0, ref: 0, _id: 0 } },
        { $unwind: '$article' },
      ]);

      const commentReactions = await Reaction.aggregate([
        { $match: { userId, status: 'Active', type: 'COMMENT' } },
        { $project: { userId: 0 } },

        {
          $lookup: {
            from: 'comments',
            pipeline: [
              { $limit: 1 },
              {
                $lookup: {
                  from: 'articles',
                  pipeline: [
                    { $limit: 1 },
                    { $project: { publishedAt: 0, timeStamp: 0, _id: 0 } },
                  ],
                  localField: 'articleId',
                  foreignField: 'articleId',
                  as: 'info',
                },
              },
              { $unwind: '$info' },
              { $project: { _id: 0, info: 1 } },
            ],
            localField: 'ref',
            foreignField: 'comId',
            as: 'article',
          },
        },
        { $unwind: '$article' },
        { $project: { status: 0, userId: 0, ref: 0, _id: 0 } },
      ]);

      const userReactions = [...articleReactions, ...commentReactions].sort(
        (a, b) => (a.timeStamp < b.timeStamp ? 1 : -1)
      );
      res.json(userReactions);
    } else res.status(500).json({ error: 'identifier required' });
  },
};
