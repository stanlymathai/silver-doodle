const express = require('express');
const router = express.Router();

const verifyAuthentication =
  require('../../middleware/helper').verifyAuthentication;
const controller = require('../controller.action/comment.controller');

router.get(
  '/count/:articleId',
  verifyAuthentication,
  controller.totalComments
);
router.post('/', verifyAuthentication, controller.addComment);
router.post('/report', verifyAuthentication, controller.reportComment);
router.get(
  '/:articleId/:limit/',
  verifyAuthentication,
  controller.getComments
);

module.exports = router;
