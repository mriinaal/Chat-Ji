const asyncHandler = require('express-async-handler');
const Message = require('../Models/messageModel');

//@description     Get messages related to a chat
//@route           GET /api/message?chat=
//@access          Restricted
const viewMessages = asyncHandler(async (req, res) => {
    const chatId = req.query.chat; 
    if (!chatId) {
        return res.status(400).json({ message: "CHAT ID IS REQUIRED." });
    }
    const messages = await Message.find({ 
      chat: chatId 
    })
    .populate('messages.user', '_id name pic')

     // Flattening the response to get just the messages array
    const allMessages = messages.map(chat => chat.messages).flat();

    // Sort messages in ascending order based on `sentAt`
    allMessages.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt)); 

    res.status(200).json(allMessages);
});

//@description     Create new message
//@route           POST /api/message/
//@access          Restricted
const createMessage = asyncHandler(async (req, res) => {
    const { chat } = req.body;
    const message = await Message.create({
      chat: chat, 
      messages: [], 
    });
    if (message) {
        res.status(201).json({
            _id: message._id,
            chat_id: message.chat,
        });
    } else {
        res.status(400);
        throw new Error("FAILED TO CREATE MESSAGE");
    }
});

//@description     Update messages of a chat
//@route           PUT /api/message/
//@access          Restricted
const updateMessage = asyncHandler(async (req, res) => {
    const { chat, messages } = req.body;
    console.log(req.body);

    // Prepare messages to be pushed, adding sentAt as the local time
    // const messagesToPush = messages.map(msg => ({
    //     user: msg.userId,
    //     message: msg.content,
    //     sentAt: ms.sentAt,
    // }));

    // Update the message document by pushing new messages into the messages array
    await Message.updateOne(
        { chat: chat },  // Find the document by chatId
        {
            $push: {
                messages: messages
                    // $each: messagesToPush  // Use $each to push an array of messages
            }
        }
    );
    res.status(200).json("updated messages");
});

module.exports = { viewMessages, createMessage, updateMessage }