const express = require('express');
const { viewMessages, updateMessages } = require('../controllers/messageControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router()
router.route('/').get(protect, viewMessages).post(protect, updateMessages);

module.exports = router;