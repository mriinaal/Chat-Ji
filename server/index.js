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
var users=[{ }];
io.on('connection', (socket)=>{
    // console.log(`User Connected`.green);
    socket.on('joined', (data)=>{
        // console.log(socket.id);
        users[socket.id] = data.userName;
        // console.log(users[socket.id]);
        // console.log(`${data.userName} Joined`);
        socket.emit(`welcome`, {user:`Admin`, message:`Welcome to Chat Zone`});
        socket.broadcast.emit(`sendMessage`, {user:`Admin`, message:`${users[socket.id]} has joined the chat`});

        socket.on('message', ({message, id, userPic}) => {
            // console.log(id);
            // console.log(userPic);
            io.emit('sendMessage', {user:`${users[id]}`, message, id, userPic});
        });

        socket.on('disconnect', ()=>{
            socket.broadcast.emit('sendMessage', {user:`Admin`, message:`${users[socket.id]} Disconnected`});
        });
    });
});
//!------------------------------------Socket------------------------------------!\\ 

if(process.env.NODE_ENV == PROD){
    server.listen(PORT, ()=>{
        console.log(`${PORT}`);
        console.log(`Server running on: https://chatji.onrender.com`.yellow);
    });
}
else server.listen(PORT, ()=> console.log(`Server running on: http://localhost:${PORT}`.yellow));