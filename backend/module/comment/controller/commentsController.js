const Comment = require('../model/commentsModel');

const addComment = (req, res) => {
  const comment = new Comment(req.body.payload);
  comment
    .save()
    .then(() => res.status(200).json({ message: 'Success' }))
    .catch((err) => res.status(500).json({ error: err }));
};

const getComments = (req, res) => {
  let articleId = req.params.articleId;
  Comment.find({})
    .lean()
    .exec()
    .then((comments) => {
      return res.json(comments);
      let rec = (comment, threads) => {
        for (var thread in threads) {
          value = threads[thread];

          if (thread.toString() === comment.parentId.toString()) {
            value.children[comment._id] = comment;
            return;
          }

          if (value.children) {
            rec(comment, value.children);
          }
        }
      };
      let threads = {},
        comment;
      for (let i = 0; i < comments.length; i++) {
        comment = comments[i];
        comment['children'] = {};
        let parentId = comment.parentId;
        if (!parentId) {
          threads[comment._id] = comment;
          continue;
        }
        rec(comment, threads);
      }
      res.json({
        count: comments.length,
        comments: threads,
      });
    })
    .catch((err) => res.status(500).json({ error: err }));
};

module.exports = {
  addComment,
  getComments,
};
