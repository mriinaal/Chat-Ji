const asyncHandler = require('express-async-handler');
const Chat = require('../Models/chatModel');

//@description     Get chats related to a user
//@route           GET /api/chat?user=
//@access          Restricted
const userChats = asyncHandler(async (req, res) => {
    const userId = req.query.user; 
    if (!userId) {
        return res.status(400).json({ message: "USER ID IS REQUIRED." });
    }
    const chats = await Chat.find({ 
      users: userId 
    })
    .populate('users', 'name email pic')
    .sort({ updatedAt: -1 });

    res.status(200).json(chats); 
});

//@description     Create a new chat
//@route           POST /api/chat/
//@access          Restricted
const createChat = asyncHandler(async (req, res) => {
    const { chatName, isGroupChat, users, groupAdmin } = req.body;
    const existingChat = await Chat.findOne({ 
        isGroupChat: isGroupChat,
        users: { $all: users } 
    });
    if (existingChat) {
        return res.status(400).json({ message: "CHAT ALREADY EXISTS" });
    }
    const chat = await Chat.create({
      chatName, 
      isGroupChat, 
      users, 
      latestMessage: null, 
      groupAdmin,
    });
    if (chat) {
        res.status(201).json({
            _id: chat._id,
            chatName: chat.chatName,
            isGroupChat: chat.isGroupChat,
            users: chat.users,
            latestMessage: chat.latestMessage, 
            groupAdmin: chat.groupAdmin,
        });
    } else {
        res.status(400);
        throw new Error("FAILED TO CREATE CHAT");
    }
});

module.exports = { userChats, createChat }