const express = require('express');
const router = express.Router();

const verifyAuthentication =
  require("../../middleware/helper").verifyAuthentication;
const commentsController = require('../controller/commentsController');


router.post('/', verifyAuthentication, commentsController.addComment);
router.get('/:articleId', verifyAuthentication, commentsController.getComments);

module.exports = router;
