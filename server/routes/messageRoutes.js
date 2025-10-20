const express = require('express');
const { viewMessages, createMessage, updateMessage } = require('../controllers/messageControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router()
router.route('/').post(protect, createMessage).get(protect, viewMessages).put(updateMessage);

module.exports = router;