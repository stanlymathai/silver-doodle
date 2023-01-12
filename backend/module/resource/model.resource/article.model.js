let mongoose = require('mongoose');

let articleSchema = mongoose.Schema(
  {
    articleId: {
      type: String,
    },
    title: {
      type: String,
    },
    slug: {
      type: String,
    },
    author: {
      type: String,
    },
    publishedAt: {
      type: Date,
    },
    timeStamp: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Articles', articleSchema);
