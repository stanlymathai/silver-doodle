const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.get('/', (_, res) =>
  res.status(404).json('MoniTalks Comment-session API Server')
);

router.post('/auth', authController.index);

module.exports = router;
