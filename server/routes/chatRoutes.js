const express = require('express');
const { createChat, userChats } = require('../controllers/chatControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router()
router.route('/').post(protect, createChat).get(protect, userChats);

module.exports = router;