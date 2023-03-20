const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const controller = require('../controller.resource/profanity.controller');

router.post('/add', controller.addToList);
router.post('/update', controller.updateList);

router.get('/list', controller.getList);
router.get('/history', controller.history);
router.post('/remove', controller.softDelete);
router.post('/config', controller.configuration);

router.post(
  '/upload',
  upload.single('bulkUploadFile'),
  controller.addMultipleSwears
);

module.exports = router;
