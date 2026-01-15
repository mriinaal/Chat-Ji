const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const dotenv = require("dotenv");
dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI,{ 
            useNewUrlParser:true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`.blue.underline.bold);
    } catch(error) {
        console.log(`Error: ${error.message}`.red.bold);
        process.exit();
    }
}

module.exports = connectDB;