const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
    {
        chatName: { type: String, trim: true, default: null },
        isGroupChat: { type: Boolean, default: false },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null },
        groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Chat', chatSchema);