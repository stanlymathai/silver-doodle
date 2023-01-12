let mongoose = require('mongoose');

let commentSchema = mongoose.Schema(
  {
    userId: {
      type: String,
    },
    comId: {
      type: String,
    },
    fullName: {
      type: String,
    },
    text: {
      type: String,
    },
    avatarUrl: {
      type: String,
    },
    timeStamp: {
      type: String,
    },
    articleId: {
      type: String,
    },
    repliedToCommentId: {
      type: String,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Comments', commentSchema);
