const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("../models/User");
const EmployeeProfile = require("../models/EmployeeProfile");
const Salary = require("../models/Salary");

dotenv.config();

const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/dayflow";

async function ensureUser({ employeeId, email, password, role }) {
  let user = await User.findOne({ $or: [{ email }, { employeeId }] });
  if (!user) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({ employeeId, email: email.toLowerCase(), password: hashedPassword, role, isVerified: true });
    const profile = await EmployeeProfile.create({ user: user._id, fullName: role === "ADMIN" ? "Admin User" : "Employee User" });
    const salary = await Salary.create({ user: user._id, basicPay: 0, allowances: 0, deductions: 0 });
    profile.salary = salary._id;
    await profile.save();
    console.log(`Created ${role} user: ${email}`);
  } else {
    console.log(`User already exists: ${email}`);
  }
  return user;
}

async function main() {
  await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log("Connected to MongoDB");

  await ensureUser({ employeeId: "ADMIN001", email: "admin@dayflow.com", password: "Admin@123", role: "ADMIN" });
  await ensureUser({ employeeId: "EMP002", email: "emp2@dayflow.com", password: "Password123", role: "EMPLOYEE" });

  await mongoose.disconnect();
  console.log("Seed complete");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
