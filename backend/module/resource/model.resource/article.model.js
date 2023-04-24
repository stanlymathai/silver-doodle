let mongoose = require('mongoose');

let articleSchema = mongoose.Schema(
  {
    articleId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    platformId: {
      type: String,
      required: true,
    },
    publishedAt: {
      type: Date,
    },
    timeStamp: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Articles', articleSchema);
