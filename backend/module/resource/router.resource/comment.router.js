const express = require('express');
const router = express.Router();

const verifyAuthentication =
  require('../../common/helper').verifyAuthentication;
const controller = require('../controller.resource/comment.controller');

router.post('/', verifyAuthentication, controller.addComment);
router.get('/:articleId/:userId', verifyAuthentication, controller.getComments);
router.get('/all', controller.getAllComments);

module.exports = router;
