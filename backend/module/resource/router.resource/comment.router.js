const express = require('express');
const router = express.Router();

const verifyAuthentication =
  require('../../common/helper').verifyAuthentication;
const controller = require('../controller.resource/comment.controller');

router.post('/', verifyAuthentication, controller.addComment);
router.get('/:articleId/:limit/', verifyAuthentication, controller.getComments);
router.get('/count/:articleId', verifyAuthentication, controller.totalComments);

module.exports = router;
