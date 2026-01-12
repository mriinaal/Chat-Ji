const express = require('express'); 
const app = express();
app.use(express.json()); //* to accept json data

const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const PORT = process.env.PORT;

const connectDB = require("./config/db");
connectDB();

const colors = require('colors');

const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatRoutes);
const messageRoutes = require('./routes/messageRoutes');
app.use('/api/message', messageRoutes);

const { notFound, errorHandler } = require('./middleware/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

const socketIO = require("socket.io");
const server = require('http').Server(app);
const io = socketIO(server);

const cors = require('cors');
app.use(cors());

const PROD = "production";

//!----------------------------------Deployment----------------------------------!\\ 
const __dirname1 = path.resolve();
if(process.env.NODE_ENV == PROD){
    app.use(express.static(path.join(__dirname1, "../app/build-onrender")));
    app.get('*', (req, res) =>res.sendFile(path.resolve(__dirname1,"app", "build-onrender", "index.html")));
}
else app.get(`/`, (req, res)=>res.status(200).send(`Blame it on me`));
//!----------------------------------Deployment----------------------------------!\\ 

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
        
        // Check if chat[3] is an array
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

    // socket.on('joined', (data)=>{
    //     // console.log(socket.id);
    //     users[socket.id] = data.userName;
    //     // console.log(users[socket.id]);
    //     // console.log(`${data.userName} Joined`);
    //     socket.emit(`welcome`, {user:`Admin`, message:`Welcome to Chat Zone`});
    //     socket.broadcast.emit(`sendMessage`, {user:`Admin`, message:`${users[socket.id]} has joined the chat`});

    //     // socket.on('message', ({message, socketId, userPic}) => {
    //     //     // console.log(id);
    //     //     // console.log(userPic);
    //         io.emit('sendMessage', {user:`${users[socketId]}`, message, socketId, userPic});
    //     // });

    //     socket.on('disconnect', ()=>{
    //         socket.broadcast.emit('sendMessage', {user:`Admin`, message:`${users[socket.id]} Disconnected`});
    //     });
    // });
});
//!------------------------------------Socket------------------------------------!\\ 

if(process.env.NODE_ENV == PROD){
    server.listen(PORT, ()=>{
        console.log(`${PORT}`);
        console.log(`Server running on: https://chatji.onrender.com`.yellow);
    });
}
else server.listen(PORT, ()=> console.log(`Server running on: http://localhost:${PORT}`.yellow));