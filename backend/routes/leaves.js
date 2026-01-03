const express = require("express");
const LeaveRequest = require("../models/LeaveRequest");
const EmployeeProfile = require("../models/EmployeeProfile");

const router = express.Router();

router.get("/my-requests", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const leaves = await LeaveRequest.find({ user: req.userId })
      .populate("user", "employeeId email")
      .populate("reviewedBy", "email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get employee names
    const userIds = leaves.map((l) => l.user?._id).filter(Boolean);
    const profiles = await EmployeeProfile.find({ user: { $in: userIds } })
      .select("user fullName")
      .lean();
    const profileMap = new Map(profiles.map((p) => [p.user.toString(), p.fullName]));

    const data = leaves.map((l) => ({
      ...l.toObject(),
      employeeName: profileMap.get(l.user?._id?.toString()) || l.user?.employeeId || "Employee",
    }));

    const total = await LeaveRequest.countDocuments({ user: req.userId });

    res.json({ data, total, page, limit });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    if (req.userRole !== "ADMIN") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const leaves = await LeaveRequest.find()
      .populate("user", "employeeId email")
      .populate("reviewedBy", "email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get employee names
    const userIds = leaves.map((l) => l.user?._id).filter(Boolean);
    const profiles = await EmployeeProfile.find({ user: { $in: userIds } })
      .select("user fullName")
      .lean();
    const profileMap = new Map(profiles.map((p) => [p.user.toString(), p.fullName]));

    const data = leaves.map((l) => ({
      ...l.toObject(),
      employeeName: profileMap.get(l.user?._id?.toString()) || l.user?.employeeId || "Employee",
    }));

    const total = await LeaveRequest.countDocuments();

    res.json({ data, total, page, limit });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { leaveType, startDate, endDate, remarks } = req.body;

    if (!leaveType || !startDate || !endDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const leave = new LeaveRequest({
      user: req.userId,
      leaveType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      remarks,
      status: "Pending"
    });

    await leave.save();

    const populated = await leave.populate("user", "employeeId email");

    res.status(201).json({ message: "Leave request submitted successfully", leave: populated });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:leaveId/approve", async (req, res) => {
  try {
    if (req.userRole !== "ADMIN") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const leave = await LeaveRequest.findById(req.params.leaveId);

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    leave.status = "Approved";
    leave.reviewedBy = req.userId;
    leave.reviewDate = new Date();
    leave.reviewComments = req.body.comments;

    await leave.save();

    res.json({ message: "Leave request approved", leave });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:leaveId/reject", async (req, res) => {
  try {
    if (req.userRole !== "ADMIN") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const leave = await LeaveRequest.findById(req.params.leaveId);

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    leave.status = "Rejected";
    leave.reviewedBy = req.userId;
    leave.reviewDate = new Date();
    leave.reviewComments = req.body.comments;

    await leave.save();

    res.json({ message: "Leave request rejected", leave });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
