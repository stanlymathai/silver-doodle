const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.get('/', authController.root);
router.post('/token', authController.index);

module.exports = router;
