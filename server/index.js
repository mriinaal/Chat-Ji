const express = require('express'); //* importing express;
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }) //* importing dotenv & using config() function;
// const chats = require('./data/data'); //* api/dummyData;
const connectDB = require("./config/db");
const colors = require('colors');
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');


connectDB();

const app = express(); //* creating an instance of express app;
app.use(express.json()); //* to accept json data

app.get(`/`, (req, res)=>{
    res.status(200).send(`API is Running gg`);
});

app.use('/api/user', userRoutes);

app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 5000 ;
app.listen(PORT, () => {
    console.log(`Server Started on PORT: ${PORT}`.yellow.bold) //! frontend and backend should run on same port; for backend(nodeJS) - .env, for frontend(react) - "proxy" in package.json
});
