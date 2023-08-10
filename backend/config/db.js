const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const MONGO_CONN_URL = `mongodb+srv://${process.env.DB_username}:${process.env.DB_password}@${process.env.DB_hostname}.mongodb.net/${process.env.DB_name}?retryWrites=true&w=majority`;

module.exports = {
  connect: async () => {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGO_CONN_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  },
};
