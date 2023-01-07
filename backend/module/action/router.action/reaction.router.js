const express = require('express');
const router = express.Router();

const verifyAuthentication =
  require('../../middleware/helper').verifyAuthentication;
const controller = require('../controller.action/reaction.controller');

router.post('/', verifyAuthentication, controller.handleReaction);

module.exports = router;
