const express = require('express'); //* importing express;
const app = express(); //* creating an instance of express app;

const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }) //* importing dotenv & using config() function;
// const chats = require('./data/data'); //* api/dummyData;
const connectDB = require("./config/db");
const colors = require('colors');
const userRoutes = require('./routes/userRoutes');
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

//!----------------------------------Deployment----------------------------------!\\ 

const __dirname1 = path.resolve();

if(process.env.NODE_ENV == "production"){
    app.use(express.static(path.join(__dirname1, "../app/build")));

    app.get('*', (req, res) =>{
        res.sendFile(path.resolve(__dirname1,"app", "build", "index.html"));
    });
}
else{
    app.get(`/`, (req, res)=>{
        res.status(200).send(`API is Running gg`);
    });
}

//!----------------------------------Deployment----------------------------------!\\ 

app.use(notFound);
app.use(errorHandler);

var users=[{ }];

io.on('connection', (socket)=>{
    // console.log(`User Connected`.green);
    socket.on('joined', (data)=>{
        // console.log(socket.id);
        users[socket.id] = data.userName;
        // console.log(users[socket.id]);
        console.log(`${data.userName} Joined`);
        socket.emit(`welcome`, {user:`Admin`, message:`Welcome to Chat Zone`});
        socket.broadcast.emit(`userJoined`, {user:`Admin`, message:`${users[socket.id]} has joined the chat`});

        socket.on('message', ({message, id, userPic}) => {
            // console.log(id);
            // console.log(userPic);
            io.emit('sendMessage', {user:`${users[id]}`, message, id, userPic});
        });

        socket.on('disconnect', ()=>{
            socket.broadcast.emit('user-disconnect', {user:`Admin`, message:`${users[socket.id]} Disconnected`} );
        });
    });
});

server.listen(PORT, ()=>{
    console.log(`> Server Running On Port: https://chatji.onrender.com <`.yellow);
});

// app.listen(PORT, () => {
//     console.log(`Server Started on PORT: ${PORT}`.yellow.bold) //! frontend and backend should run on same port; for backend(nodeJS) - .env, for frontend(react) - "proxy" in package.json
// });
