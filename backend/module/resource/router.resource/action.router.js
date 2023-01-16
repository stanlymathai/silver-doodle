const express = require('express');
const router = express.Router();

const verifyAuthentication =
  require('../../common/helper').verifyAuthentication;
const controller = require('../controller.resource/action.controller');

router.post('/report', verifyAuthentication, controller.reportComment);
router.post('/react', verifyAuthentication, controller.handleReaction);

router.get('/user-reaction/:userId', controller.getUserReaction);

module.exports = router;
