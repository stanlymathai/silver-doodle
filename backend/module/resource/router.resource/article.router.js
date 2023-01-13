const express = require('express');
const router = express.Router();

const controller = require('../controller.resource/article.controller');

router.get('/', controller.getAllArticles);

module.exports = router;
