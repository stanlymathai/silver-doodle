const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "./config/env/dev.env" });

// db config
const db = require("./config/db");
db.connect()
  .then(() => console.log("DB connected"))
  .catch((e) => console.log("DB connection failed ", e));

const passport = require("./module/middleware/passport.js");

// include routes
const authRoute = require("./module/auth/router/auth");
const userRoute = require("./module/auth/router/users");
const commentRoute = require("./module/comment/router/comments");

const app = express();

// enable preflight requests
app.use(cors());

//initialize passport
app.use(passport.initialize());

// parsing body request
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: false }));

//routing
app.use(process.env.ENDPOINT_API + "/", authRoute);
app.use(process.env.ENDPOINT_API + "/user", userRoute);
app.use(process.env.ENDPOINT_API + "/comment", commentRoute);

module.exports = app;