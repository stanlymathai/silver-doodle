const express = require('express');
const router = express.Router();

const verifyAuthentication =
  require('../../common/helper').verifyAuthentication;
const controller = require('../controller.resource/comment.controller');

router.post('/', verifyAuthentication, controller.addComment);
router.get('/:articleId', verifyAuthentication, controller.getComments);

module.exports = router;
