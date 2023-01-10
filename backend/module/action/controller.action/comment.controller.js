const Comment = require('../model.action/comment.model');
const Reaction = require('../model.action/reaction.model');

module.exports = {
  addComment(req, res) {
    const comment = new Comment(req.body.payload);
    comment
      .save()
      .then(() => res.json({ message: 'Success' }))
      .catch((e) => res.status(500).json({ error: e }));
  },

  totalComments(req, res) {
    Comment.find({ repliedToCommentId: null, articleId: req.params.articleId })
      .count()
      .lean()
      .exec()
      .then((count) => res.json({ count }))
      .catch((e) => res.status(500).json({ error: e }));
  },

  async getComments(req, res) {
    let articleId = req.params.articleId;

    if (!articleId)
      return res.status(500).json({ error: 'article slug required' });
    try {
      let articleQueryParams = {
        ref: articleId,
        status: 'Active',
        type: 'ARTICLE',
      };
      let articleData = {
        articleId,
        reaction: {
          like: await Reaction.exists({
            ...articleQueryParams,
            userId: req.user.id,
            reaction: 'like',
          }).then((el) => (el ? true : false)),
          brilliant: await Reaction.exists({
            ...articleQueryParams,
            userId: req.user.id,
            reaction: 'brilliant',
          }).then((el) => (el ? true : false)),
          thoughtful: await Reaction.exists({
            ...articleQueryParams,
            userId: req.user.id,
            reaction: 'thoughtful',
          }).then((el) => (el ? true : false)),
        },
        reactionCount: await Reaction.countDocuments(articleQueryParams),
      };
      let threads = await Comment.find(
        { repliedToCommentId: null, articleId: req.params.articleId },
        { articleId: 0, _id: 0 }
      )
        .limit(req.params.limit)
        .sort({ _id: -1 })
        .lean()
        .exec();

      let replies = await Comment.find(
        {
          repliedToCommentId: { $in: threads.map(({ comId }) => comId) },
        },
        { articleId: 0, _id: 0 }
      )
        .lean()
        .exec();

      replies.forEach((thread) => {
        thread.reaction = {
          like: Math.random() < 0.5,
          brilliant: Math.random() < 0.5,
          thoughtful: Math.random() < 0.5,
        };
        thread.reactionCount = Math.floor(Math.random() * 9999);
      });

      threads.forEach((thread) => {
        thread.replies = replies.filter(
          (i) => i.repliedToCommentId == thread.comId
        );
        thread.reaction = {
          like: Math.random() < 0.5,
          brilliant: Math.random() < 0.5,
          thoughtful: Math.random() < 0.5,
        };
        thread.reactionCount = Math.floor(Math.random() * 99);
      });

      res.json({ threads, articleData });
    } catch (error) {
      res.status(500).json({ error });
    }
  },
  reportComment(req, res) {
    let reportData = req.body.payload;
    res.json({ reportData });
  },
};
