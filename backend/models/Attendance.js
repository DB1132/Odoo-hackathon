const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  checkIn: {
    type: String,
    default: null
  },
  checkOut: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ["Present", "Absent", "Half-day", "Leave"],
    default: "Present"
  },
  workingHours: Number
}, { timestamps: true });

attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
