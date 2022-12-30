const Comment = require('../model/commentsModel');

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
    try {
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

      threads.forEach((thread) => {
        thread.replies = replies.filter(
          (i) => i.repliedToCommentId == thread.comId
        );
      });

      res.json({ threads });
    } catch (error) {
      res.status(500).json({ error });
    }
  },
};
