let mongoose = require('mongoose');

let commentSchema = mongoose.Schema(
  {
    comId: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    timeStamp: {
      type: String,
      required: true,
    },
    articleId: {
      type: String,
    },
    moderated: {
      type: Boolean,
    },
    moderator: {
      type: String,
    },
    moderateReason: {
      type: String,
    },
    parentId: {
      type: String,
    },
    status: {
      type: String,
      default: 'Active',
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Comments', commentSchema);
