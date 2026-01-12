const asyncHandler = require('express-async-handler');
const Message = require('../Models/messageModel');

//@description     Get messages related to a chat
//@route           GET /api/message?user=
//@access          Restricted
const viewMessages = asyncHandler(async (req, res) => {
    const chatId = req.query.user; 
    if (!chatId) {
        return res.status(400).json({ message: "USER ID IS REQUIRED." });
    }
    const messages = await Message.find({ 
      chat: chatId 
    })
    .populate('chat')
    .populate('user', '_id name email pic')

    // Flattening the response to get just the messages array
    // const allMessages = messages.map(chat => chat.messages).flat();

    // Sort messages in ascending order based on `sentAt`
    // allMessages.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt)); 

    const transformedMessages = messages.map(msg => ({
        chat:msg.chat,
        _id:msg._id,
        message: msg.message,
        userName: msg.user.name,
        userId: msg.user._id,
        userPic: msg.user.pic,
    }));

    res.status(200).json(transformedMessages);
});

//@description     Add messages
//@route           POST /api/message/
//@access          Restricted
const updateMessages = asyncHandler(async (req, res) => {
    const { chatId, userId, msg } = req.body;
    // console.log(chatId, userId, msg);
    try {
        const newMsg = await Message.create({
              chat: chatId, 
              user: userId, 
              message: msg, 
            });
        if (newMsg) {
            res.status(200).json("Message saved");
        }
    } catch (error) {
        console.log(error.message);
        throw new Error();
    }
});

module.exports = { viewMessages, updateMessages }