const express = require('express');
const router = express.Router();
const controller = require('../controller.auth/auth.controller');

router.get('/', controller.index);
router.post('/auth', controller.main);
router.get('/info/social/:id', controller.social);

module.exports = router;
