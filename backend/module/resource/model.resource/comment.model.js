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
    parentId: {
      type: String,
    },
    status: {
      type: String,
      default: 'Active',
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
    acknowledgedBy: {
      type: String,
    },
    acknowledgedAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Comments', commentSchema);
