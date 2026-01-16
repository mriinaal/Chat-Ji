const express = require('express'); //* importing express;
const app = express(); //* creating an instance of express app;

const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }) //* importing dotenv & using config() function;
// const chats = require('./data/data'); //* api/dummyData;
const connectDB = require("./config/db");
const colors = require('colors');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const socketIO = require("socket.io");
const server = require('http').Server(app);
const io = socketIO(server);

const cors = require('cors'); //* installing cors middleware heps in communication between url;

const PORT = process.env.PORT;

connectDB();

app.use(express.json()); //* to accept json data

app.use(cors());

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

//!----------------------------------Deployment----------------------------------!\\ 
const PROD = "production";
const __dirname1 = path.resolve();

if(process.env.NODE_ENV == PROD){
    app.use(express.static(path.join(__dirname1, "../app/build-onrender")));
    app.get('*', (req, res) =>{
        res.sendFile(path.resolve(__dirname1,"../app", "build-onrender", "index.html"));
    });
}
else app.get(`/`, (req, res)=>res.status(200).send(`Blame it on me`));

//!----------------------------------Deployment----------------------------------!\\ 

app.use(notFound);
app.use(errorHandler);

//!------------------------------------Socket------------------------------------!\\ 
var users=[];
io.on('connection', (socket)=>{
    // console.log(`User Connected`.green);
    // console.log(`User Connected: ${socket.id}`);

    socket.on('joined', (userId) => {
        // Check if the user is already in the list
        const userIndex = users.findIndex(user => user.id === socket.id);
        
        if (userIndex === -1) {
            // Add new user if not present
            users.push({ id: socket.id, userId: userId });
        } else {
            // Update existing user if necessary (optional)
            users[userIndex].userId = userId;
        }

        if (!socket.rooms.has(userId)) {
            socket.join(userId);
        }

        const onlineUsers = users.map(online => online.userId).flat();
        // console.log(onlineUsers); // Log users array
        io.emit('status', onlineUsers); // Emit new user status
    });

    socket.on('message', ({ chat, _id, message, userName, userId, userPic }) => {
        // console.log(chat, message);
        
        if (chat[4]) { //groupChatVariable
            // Iterate through all users in the array
            chat[3].forEach(user => {
                io.to(user._id).emit('sendMessage', { 
                    chat, 
                    _id, 
                    message, 
                    userName, 
                    userId, 
                    userPic 
                });
            });
        } else {
            io.to(userId).to(chat[3]).emit('sendMessage', { 
                chat, _id, message, userName, userId, userPic
            });
        }
        
    });

    socket.on('sendCall', ({chat, userId, userName, userPic}) =>{
        // console.log(chat, userId, userName, userPic);
        if (chat[4]) { //groupChatVariable
            // Iterate through all users in the array
            chat[3].forEach(user => {
                if(user._id !== userId){
                    io.to(user._id).emit('sendCall', {chat, userId, userName, userPic});
                }
            });
        } else {
            io.to(chat[3]).emit('sendCall', {chat, userId, userName, userPic});
        }
    });

    socket.on('typingSocketEvent', ({chat, userId, userName, userPic}) =>{
        // console.log(chat, userId, userName, userPic);
        if (chat[4]) { //groupChatVariable
            // Iterate through all users in the array
            chat[3].forEach(user => {
                if(user._id !== userId){
                    io.to(user._id).emit('typingSocketEvent', {chat, userId, userName, userPic});
                }
            });
        } else {
            io.to(chat[3]).emit('typingSocketEvent', {chat, userId, userName, userPic});
        }
    });

    socket.on('disconnect', () => {
        // Remove user from the array on disconnect
        const userIndex = users.findIndex(user => user.id === socket.id);
        if (userIndex !== -1) {
            users.splice(userIndex, 1);
            const onlineUsers = users.map(online => online.userId).flat();
            // console.log(onlineUsers);
            socket.broadcast.emit('status', onlineUsers); // Emit updated user list
        }
        // console.log(users);
        // console.log(`User Disconnected: ${socket.id}`);
    });
});
//!------------------------------------Socket------------------------------------!\\ 

if(process.env.NODE_ENV == PROD){
    server.listen(PORT, ()=>{
        // console.log(`${PORT}`);
        console.log(`Server running on: https://chatji.onrender.com/`.yellow);
    });
}
else server.listen(PORT, ()=> console.log(`Server running on: http://localhost:${PORT}`.yellow));
