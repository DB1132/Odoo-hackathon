const mongoose = require("mongoose");
const Attendance = require("./models/Attendance");
require("dotenv").config();

async function cleanup() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/dayflow");
    console.log("Connected to MongoDB");

    const result = await Attendance.deleteMany({
      $or: [
        { checkIn: null },
        { checkIn: "" },
        { checkIn: { $exists: false } }
      ]
    });

    console.log(`✓ Deleted ${result.deletedCount} invalid attendance records`);
    
    const remaining = await Attendance.countDocuments();
    console.log(`✓ Remaining attendance records: ${remaining}`);
    
    await mongoose.connection.close();
    console.log("✓ Cleanup completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error during cleanup:", error);
    process.exit(1);
  }
}

cleanup();
