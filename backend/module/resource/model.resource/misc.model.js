const mongoose = require('mongoose');
const miscSchema = mongoose.Schema(
  {
    type: {
      type: String,
      unique: true,
      required: true,
    },
    prelude: {
      type: Object,
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Misc', miscSchema);
