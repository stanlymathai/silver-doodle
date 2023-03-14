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
    type: {
      type: String,
      default: 'Added',
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Profanity', profanitySchema);
