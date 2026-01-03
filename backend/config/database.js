const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/dayflow";
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    return Promise.resolve();
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    return Promise.reject(error);
  }
};

module.exports = connectDB;
