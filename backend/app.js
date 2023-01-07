const cors = require('cors');
const express = require('express');

// Loads .env file contents into process.env.
require('dotenv').config({ path: './config/env/dev.env' });

// db config.
const db = require('./config/db');
db.connect()
  .then(() => console.log('DB connected'))
  .catch((e) => console.log('DB connection failed ', e));

//  routes.

const authRoute = require('./module/auth/router.auth/auth.router');
const userRoute = require('./module/auth/router.auth/user.router');
const commentRoute = require('./module/action/router.action/comment.router');
const reactionRoute = require('./module/action/router.action/reaction.router');

// Creating an Express application.
const app = express();

// enable preflight requests.
app.use(cors());

// initialize passport.
const passport = require('./module/middleware/passport.js');
app.use(passport.initialize());

// parsing body request.
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: false }));

// routing requests.
app.use(process.env.ENDPOINT_API + '/', authRoute);
app.use(process.env.ENDPOINT_API + '/user', userRoute);
app.use(process.env.ENDPOINT_API + '/comment', commentRoute);
app.use(process.env.ENDPOINT_API + '/reaction', reactionRoute);

module.exports = app;
