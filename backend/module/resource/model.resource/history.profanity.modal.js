let mongoose = require('mongoose');

let profanitySchema = mongoose.Schema(
  {
    profanityId: {
      type: String,
    },
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
    internalId: {
      type: String,
      required: true,
    },
    oldWord: {
      type: String,
    },
    newWord: {
      type: String,
    },
    oldCountry: {
      type: String,
    },
    newCountry: {
      type: String,
    },
    type: {
      type: String,
      required: true,
    },
    timestamp: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = mongoose.model('ProfanityHistory', profanitySchema);
