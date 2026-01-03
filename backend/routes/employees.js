const express = require("express");
const EmployeeProfile = require("../models/EmployeeProfile");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    if (req.userRole !== "ADMIN") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const profiles = await EmployeeProfile.find()
      .populate("user", "employeeId email role")
      .populate("salary")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await EmployeeProfile.countDocuments();

    res.json({ data: profiles, total, page, limit });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/profile/:userId", async (req, res) => {
  try {
    const profile = await EmployeeProfile.findOne({ user: req.params.userId })
      .populate("user", "employeeId email role")
      .populate("salary");

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (req.userId !== req.params.userId && req.userRole !== "ADMIN") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/profile/:userId", async (req, res) => {
  try {
    const { fullName, phone, address, jobTitle, department, profilePicture } = req.body;

    if (req.userId !== req.params.userId && req.userRole !== "ADMIN") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const profile = await EmployeeProfile.findOne({ user: req.params.userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (fullName) profile.fullName = fullName;
    if (phone) profile.phone = phone;
    if (address) profile.address = address;
    if (jobTitle) profile.jobTitle = jobTitle;
    if (department) profile.department = department;
    if (profilePicture) profile.profilePicture = profilePicture;

    await profile.save();

    const updatedProfile = await profile.populate("user", "employeeId email role").populate("salary");

    res.json({ message: "Profile updated successfully", profile: updatedProfile });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
