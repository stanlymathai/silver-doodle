const express = require('express');
const router = express.Router();

const controller = require('../controller.resource/platform.controller');

router.post('/update', controller.updatePlatform);
router.get('/list', controller.getPlatformList);
router.post('/remove', controller.softDelete);
router.post('/add', controller.addPlatform);

module.exports = router;
