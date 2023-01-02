const express = require('express');
const router = express.Router();

const verifyAuthentication =
  require('../../middleware/helper').verifyAuthentication;
const commentsController = require('../controller/commentsController');

router.get(
  '/count/:articleId',
  verifyAuthentication,
  commentsController.totalComments
);
router.post('/', verifyAuthentication, commentsController.addComment);
router.post('/report', verifyAuthentication, commentsController.reportComment);
router.get(
  '/:articleId/:limit/',
  verifyAuthentication,
  commentsController.getComments
);

module.exports = router;
