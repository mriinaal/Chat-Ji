const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        message: { type: String, trim: true, required: true, minlength: 1 },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);