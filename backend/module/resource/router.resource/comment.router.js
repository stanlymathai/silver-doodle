const express = require('express');
const router = express.Router();

const { verifyAuthentication } = require('../../common/helper');
const controller = require('../controller.resource/comment.controller');

// admin routes.
router.get('/all', controller.getAllComments);
router.post('/moderate', controller.moderateComment);
router.post('/guest-view', controller.guestViewComments);
router.post('/acknowledge', controller.acknowledgeComment);
router.get('/user-comment/:userId', controller.getUserComments);
router.post('/fetch-unreviewed', controller.fetchUnReviewedComments);

// marketing routes.
router.post('/', verifyAuthentication, controller.addComment);
router.post('/fetch', verifyAuthentication, controller.getComments);

module.exports = router;
