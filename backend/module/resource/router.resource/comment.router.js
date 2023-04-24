const express = require('express');
const router = express.Router();

const verifyAuthentication =
  require('../../common/helper').verifyAuthentication;
const controller = require('../controller.resource/comment.controller');

router.post('/all', controller.getAllComments);
router.post('/moderate', controller.moderateComment);
router.post('/guest-view', controller.guestViewComments);
router.post('/acknowledge', controller.acknowledgeComment);
router.post('/', verifyAuthentication, controller.addComment);
router.get('/user-comment/:userId', controller.getUserComments);
router.post('/fetch', verifyAuthentication, controller.getComments);

module.exports = router;
