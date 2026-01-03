const express = require("express");
const Salary = require("../models/Salary");
const EmployeeProfile = require("../models/EmployeeProfile");

const router = express.Router();

router.get("/my-salary", async (req, res) => {
  try {
    const salary = await Salary.findOne({ user: req.userId }).populate("user", "email");

    if (!salary) {
      return res.status(404).json({ message: "Salary information not found" });
    }

    res.json(salary);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Admin: get all salaries with profile info
router.get("/", async (req, res) => {
  try {
    if (req.userRole !== "ADMIN") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const salaries = await Salary.find()
      .populate("user", "email employeeId role")
      .lean();

    const userIds = salaries.map((s) => s.user?._id).filter(Boolean);
    const profiles = await EmployeeProfile.find({ user: { $in: userIds } })
      .select("user fullName")
      .lean();
    const profileMap = new Map(profiles.map((p) => [p.user.toString(), p.fullName]));

    const data = salaries.map((s) => ({
      ...s,
      fullName: profileMap.get(s.user?._id?.toString()) || "",
    }));

    res.json({ data, total: data.length });
  } catch (error) {
    console.error("Error fetching salaries:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:employeeId", async (req, res) => {
  try {
    if (req.userRole !== "ADMIN") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const salary = await Salary.findOne({ user: req.params.employeeId }).populate("user", "email");

    if (!salary) {
      return res.status(404).json({ message: "Salary information not found" });
    }

    res.json(salary);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:employeeId", async (req, res) => {
  try {
    if (req.userRole !== "ADMIN") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { basicPay, allowances, deductions } = req.body;

    const salary = await Salary.findOne({ user: req.params.employeeId });

    if (!salary) {
      return res.status(404).json({ message: "Salary information not found" });
    }

    if (basicPay !== undefined) salary.basicPay = basicPay;
    if (allowances !== undefined) salary.allowances = allowances;
    if (deductions !== undefined) salary.deductions = deductions;

    await salary.save();

    res.json({ message: "Salary updated successfully", salary });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
