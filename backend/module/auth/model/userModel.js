const mongoose = require('mongoose');
const userSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    authAccessToken: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Users', userSchema);
