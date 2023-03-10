const express = require('express');
const router = express.Router();

const controller = require('../controller.resource/profanity.controller');

router.post('/add', controller.addToList);
router.post('/update', controller.updateList);

router.get('/list', controller.getList);
router.get('/history', controller.history);
router.post('/remove', controller.softDelete);

module.exports = router;
