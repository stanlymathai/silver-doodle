let mongoose = require('mongoose');

let reactionSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    ref: {
      type: String,
      required: true,
    },
    reaction: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    timeStamp: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Reactions', reactionSchema);
