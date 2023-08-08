const express = require('express');
const router = express.Router();
const controller = require('../controller.auth/auth.controller');

router.get('/', controller.index);
router.post('/auth', controller.main);
router.post('/admin/ban-user', controller.banUser);
router.get('/admin/reported/:id', controller.reported);
router.get('/info/social/:id', controller.userOverview);

module.exports = router;
