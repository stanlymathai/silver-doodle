const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
const MONGO_CONN_URL = `mongodb+srv://${process.env.DB_username}:${process.env.DB_password}@${process.env.DB_hostname}.mongodb.net/test?retryWrites=true&w=majority`;

module.exports = {
  connect: async () => {
    await mongoose.connect(MONGO_CONN_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  },
};
