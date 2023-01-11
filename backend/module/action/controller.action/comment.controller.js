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
    let userId = req.user.id;
    if (!articleId || !userId)
      return res
        .status(500)
        .json({ error: `unique ${userId}identifier required ${articleId}` });

    try {
      let articleQueryParams = {
        ref: articleId,
        status: 'Active',
        type: 'ARTICLE',
      };

      let articleReactions = await Reaction.aggregate([
        { $match: articleQueryParams },
        { $project: { userId: 1, reaction: 1 } },
      ]);

      const hasOneInArticle = (type) =>
        articleReactions.some(
          (el) => el.reaction == type && el.userId == userId
        );
      let articleData = {
        articleId,
        reaction: {
          like: hasOneInArticle('like'),
          brilliant: hasOneInArticle('brilliant'),
          thoughtful: hasOneInArticle('thoughtful'),
        },
        reactionCount: articleReactions.length,
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
