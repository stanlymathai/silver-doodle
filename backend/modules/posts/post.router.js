const express = require("express");
const router = express.Router();

const verifyAuthentication = require("../common/common.helper").verifyToken;

const controller = require("./post.controller");

router.get("/get-post/:id", verifyAuthentication, controller.getPostById);
router.get(
  "/get-posts/:limit/:offset",
  verifyAuthentication,
  controller.getPosts
);
router.post("/add-post", verifyAuthentication, controller.addPost);
router.get("/post-count", verifyAuthentication, controller.postCount);
router.post("/update-post", verifyAuthentication, controller.updatePost);
router.delete("/delete-post/:id", verifyAuthentication, controller.deletePost);

module.exports = router;
