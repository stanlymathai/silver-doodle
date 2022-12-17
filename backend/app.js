const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "./config/env/local.env" });

// db config
const db = require("./config/db");
db.connect()
  .then(() => console.log("DB connected"))
  .catch((e) => console.log("DB connection failed ", e));

// include routes
const commentRoute = require("./module/comment/router/comments");
const userRoute = require("./module/user/router/comments");

const app = express();

// enable preflight requests
app.use(cors());

// parsing body request
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: false }));

//routing
app.use(process.env.ENDPOINT_API + "/user", userRoute);
app.use(process.env.ENDPOINT_API + "/comment", commentRoute);

module.exports = app;
