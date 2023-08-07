const express = require('express');
const router = express.Router();

const { verifyAuthentication } = require('../../common/helper');
const controller = require('../controller.resource/comment.controller');
const adminController = require('../controller.resource/admin.controller');

// admin routes.
router.get('/all', adminController.getAllComments);
router.post('/moderate', adminController.moderateComment);
router.post('/acknowledge', adminController.acknowledgeComment);
router.get('/user-comment/:userId', adminController.getUserComments);
router.post('/fetch-unreviewed', adminController.fetchUnReviewedComments);
router.get('/unreviewed-count', adminController.unReviewedCommentsCount);

// marketing routes.
router.post('/guest-view', controller.guestViewComments);
router.post('/', verifyAuthentication, controller.addComment);
router.post('/fetch', verifyAuthentication, controller.getComments);

module.exports = router;
