const mongoose = require("mongoose");

const employeeProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  phone: String,
  address: String,
  jobTitle: String,
  department: String,
  profilePicture: String,
  salary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Salary"
  }
}, { timestamps: true });

module.exports = mongoose.model("EmployeeProfile", employeeProfileSchema);
