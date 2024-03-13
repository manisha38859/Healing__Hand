const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL);

const connection = mongoose.connection;

connection.on("connected", ()=>{
    console.log("MongoDB is connected");
});

connection.on("error", (error) => {
    console.log("Error in MongoDB connection", error);
});

// var cursor = connection.db.collection('patients').find();
//console.log(connection);

module.exports = mongoose;
  