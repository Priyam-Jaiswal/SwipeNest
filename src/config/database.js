const mongoose = require("mongoose");

const connectDB = async ()=>{
    await mongoose.connect(
        "mongodb+srv://jaiswalpriyam_db_user:SNFvr26Q9yRgllGc@cluster0.glj7gcc.mongodb.net/swipenest?retryWrites=true&w=majority&appName=Cluster0"
    );
};

module.exports = connectDB;
 