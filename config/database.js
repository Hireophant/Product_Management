const mongoose = require("mongoose");

module.exports.connect = async () => {
    try { 
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to Success");
    } catch (error) {
        console.log("Connected to Failed");
    }

}

