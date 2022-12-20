let express = require('express');
let router = express.Router();
const commentsController = require('../controller/commentsController');

router.get('/', commentsController.getComments);
router.post('/', commentsController.addComment);
router.post('/update', commentsController.updateComment);

module.exports = router;
