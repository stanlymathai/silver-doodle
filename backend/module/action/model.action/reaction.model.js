let mongoose = require('mongoose');

let reactionSchema = mongoose.Schema(
  {
    userId: {
      type: String,
    },
    ref: {
      type: String,
    },
    reaction: {
      type: String,
    },
    type: {
      type: String,
    },
    status: {
      type: String,
    },
    timeStamp: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Reactions', reactionSchema);
