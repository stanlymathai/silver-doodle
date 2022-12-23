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
    repliedToCommentId:{
      type: String,
    }
  },
  { versionKey: false }
);

// for future ref
// parentId: {
//   type: mongoose.Schema.Types.ObjectId,
//   default: null
// },
// postedDate: {type: Date, default: Date.now},
// author: {
//   id: mongoose.Schema.Types.ObjectId,
//   name: String,
// },

module.exports = mongoose.model('Comments', commentSchema);
