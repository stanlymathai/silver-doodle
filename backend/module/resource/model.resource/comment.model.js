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
    platform: {
      type: String,
      required: true,
    },
    moderated: {
      type: Boolean,
      default: false,
    },
    moderator: {
      type: String,
    },
    moderateReason: {
      type: String,
    },
    acknowledged: {
      type: Boolean,
      default: false,
    },
    tempKey: {
      type: Number,
      default: 0000,
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
