const Comment = require('../model/commentsModel');

const addComment = (req, res) => {
  let data;
  if (req.body.payload) {
    data = req.body.payload;
  } else {
    data = {
      userId: Math.random(),
      comId: Math.random(),
      fullName: Math.random(),
      text: Math.random(),
      avatarUrl:
        'https://s3.eu-west-2.amazonaws.com/prod-monitalks-media/userplaceholder_5734b83bd0.png',
      timeStamp: new Date(),
      replies: [],
    };
  }
  const comment = new Comment(data);
  comment
    .save()
    .then((comment) =>
      res.json({
        comment: comment,
      })
    )
    .catch((err) => res.status(500).json({ error: err }));
};

const updateComment = (req, res) => {
  let comment = req.body;
  Comment.updateOne(
    { _id: comment.id },
    { $set: { commentText: comment.commentText } }
  )
    .exec()
    .then((result) =>
      res.status(200).json({
        message: 'Comment Updated',
        comment: comment,
      })
    )
    .catch((err) => res.status(500).json({ error: err }));
};

const getComments = (req, res) => {
  console.log('hai from getComments', Comment);
  Comment.find({})
    .lean()
    .exec()
    .then((comments) => {
      console.log(comments, ' getComments');

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
  updateComment,
  getComments,
};
