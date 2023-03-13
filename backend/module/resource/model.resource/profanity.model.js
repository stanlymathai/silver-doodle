let mongoose = require('mongoose');

let profanitySchema = mongoose.Schema(
  {
    swear: {
      type: String,
      required: true,
    },
    countryCode: {
      type: String,
      required: true,
    },
    adminId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'Added',
    },
    timeStamp: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Profanity', profanitySchema);