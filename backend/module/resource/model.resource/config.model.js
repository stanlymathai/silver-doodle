const mongoose = require('mongoose');
const configSchema = mongoose.Schema(
  {
    type: {
      type: String,
      unique: true,
      required: true,
    },
    prelude: {
      type: Object,
    },
    history: {
      type: Array,
      default: [],
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = mongoose.model('Config', configSchema);
