let mongoose = require('mongoose');

let reportSchema = mongoose.Schema(
  {
    reportedUser: {
      type: String,
    },
    ref: {
      type: String,
    },
    reason: {
      type: String,
    },
    timeStamp: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Reports', reportSchema);