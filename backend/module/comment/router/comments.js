const express = require('express');
const router = express.Router();
const commentsController = require('../controller/commentsController');

router.get('/:articleId', commentsController.getComments);
router.post('/', commentsController.addComment);

module.exports = router;
