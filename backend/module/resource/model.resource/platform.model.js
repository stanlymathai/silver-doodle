let mongoose = require('mongoose');

let platformSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true,
    },
    resourceUrl: {
      type: String,
      required: true,
    },
    platformUrl: {
      type: String,
    },
    status: {
      type: String,
      default: 'Active',
    },
    timeStamp: { type: Date, default: Date.now },
  },
  { versionKey: false }
);
module.exports = mongoose.model('Platform', platformSchema);
