const mongoose = require('mongoose');
const userLogSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    timeouts: {
      type: Array,
      default: [],
    },
    tickers: {
      type: Array,
      default: [],
    },
    bans: {
      type: Array,
      default: [],
    },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = mongoose.model('UserLog', userLogSchema);
