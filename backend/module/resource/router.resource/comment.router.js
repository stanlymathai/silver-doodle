const express = require('express');
const router = express.Router();

const verifyAuthentication =
  require('../../common/helper').verifyAuthentication;
const controller = require('../controller.resource/comment.controller');

router.get('/all', controller.getAllComments);
router.post('/moderate', controller.moderateComment);
router.post('/acknowledge', controller.acknowledgeComment);
router.post('/', verifyAuthentication, controller.addComment);
router.get('/guest/:articleId', controller.guestViewComments);
router.get('/user-comment/:userId', controller.getUserComments);
router.get('/:articleId/:userId', verifyAuthentication, controller.getComments);

module.exports = router;
