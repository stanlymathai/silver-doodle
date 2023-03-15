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
    status: {
      type: String,
      default: 'Active',
    },
  },
  { versionKey: false }
);
// db.profanities.createIndex( { countryCode: 1, swear: 1, status: 1 }, {unique:true} )
module.exports = mongoose.model('Profanity', profanitySchema);
