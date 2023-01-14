let mongoose = require('mongoose');

let reportSchema = mongoose.Schema(
  {
    reportedUser: {
      type: String,
      required: true,
    },
    ref: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    timeStamp: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Reports', reportSchema);