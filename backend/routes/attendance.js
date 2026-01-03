const express = require("express");
const Attendance = require("../models/Attendance");
const EmployeeProfile = require("../models/EmployeeProfile");

const router = express.Router();

router.post("/check-in", async (req, res) => {
  try {
    const today = new Date().setHours(0, 0, 0, 0);
    const todayDate = new Date(today);

    let attendance = await Attendance.findOne({
      user: req.userId,
      date: todayDate
    });

    if (attendance) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    const checkInTime = new Date().toISOString();

    attendance = new Attendance({
      user: req.userId,
      date: todayDate,
      checkIn: checkInTime,
      status: "Present"
    });

    await attendance.save();

    res.status(201).json({ message: "Checked in successfully", attendance });
  } catch (error) {
    console.error("Check-in error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/check-out", async (req, res) => {
  try {
    const today = new Date().setHours(0, 0, 0, 0);
    const todayDate = new Date(today);

    const attendance = await Attendance.findOne({
      user: req.userId,
      date: todayDate
    });

    if (!attendance) {
      return res.status(404).json({ message: "No check-in record found for today" });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ message: "Already checked out today" });
    }

    const checkOutTime = new Date().toISOString();
    attendance.checkOut = checkOutTime;

    const checkIn = new Date(attendance.checkIn);
    const checkOut = new Date(checkOutTime);
    const hours = (checkOut - checkIn) / (1000 * 60 * 60);
    attendance.workingHours = parseFloat(hours.toFixed(2));

    await attendance.save();

    res.json({ message: "Checked out successfully", attendance });
  } catch (error) {
    console.error("Check-out error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/today", async (req, res) => {
  try {
    const today = new Date().setHours(0, 0, 0, 0);
    const todayDate = new Date(today);

    const attendance = await Attendance.findOne({
      user: req.userId,
      date: todayDate
    });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/my-records", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const records = await Attendance.find({ user: req.userId })
      .populate("user", "employeeId email")
      .skip(skip)
      .limit(limit)
      .sort({ date: -1 });

    const total = await Attendance.countDocuments({ user: req.userId });

    res.json({ data: records, total, page, limit });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Admin: Get all attendance records
router.get("/", async (req, res) => {
  try {
    if (req.userRole !== "ADMIN") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const records = await Attendance.find()
      .populate("user", "employeeId email")
      .skip(skip)
      .limit(limit)
      .sort({ date: -1 });

    // Get employee names
    const userIds = records.map((r) => r.user?._id).filter(Boolean);
    const profiles = await EmployeeProfile.find({ user: { $in: userIds } })
      .select("user fullName")
      .lean();
    const profileMap = new Map(profiles.map((p) => [p.user.toString(), p.fullName]));

    const data = records.map((r) => ({
      ...r.toObject(),
      employeeName: profileMap.get(r.user?._id?.toString()) || r.user?.employeeId || "Employee",
    }));

    const total = await Attendance.countDocuments();

    res.json({ data, total, page, limit });
  } catch (error) {
    console.error("Attendance fetch error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/cleanup/invalid", async (req, res) => {
  try {
    if (req.userRole !== "ADMIN") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const result = await Attendance.deleteMany({
      $or: [
        { checkIn: null },
        { checkIn: "" },
        { checkIn: undefined }
      ]
    });

    res.json({ message: "Cleanup completed", deletedCount: result.deletedCount });
  } catch (error) {
    console.error("Cleanup error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:employeeId", async (req, res) => {
  try {
    if (req.userRole !== "ADMIN") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const records = await Attendance.find({ user: req.params.employeeId })
      .populate("user", "employeeId email")
      .skip(skip)
      .limit(limit)
      .sort({ date: -1 });

    const total = await Attendance.countDocuments({ user: req.params.employeeId });

    res.json({ data: records, total, page, limit });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
