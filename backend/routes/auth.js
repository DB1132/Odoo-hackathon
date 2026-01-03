const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult, body } = require("express-validator");
const User = require("../models/User");
const EmployeeProfile = require("../models/EmployeeProfile");
const Salary = require("../models/Salary");

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "your_jwt_secret_key", {
    expiresIn: "7d"
  });
};

router.post(
  "/register",
  [
    body("employeeId").notEmpty(),
    body("fullName").trim().notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { employeeId, fullName, email, password, role = "EMPLOYEE" } = req.body;

      let user = await User.findOne({ $or: [{ email }, { employeeId }] });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({
        employeeId,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        isVerified: true
      });

      await user.save();

      const profile = new EmployeeProfile({
        user: user._id,
        fullName
      });
      await profile.save();

      const salary = new Salary({
        user: user._id,
        basicPay: 0,
        allowances: 0,
        deductions: 0
      });
      await salary.save();

      profile.salary = salary._id;
      await profile.save();

      const token = generateToken(user._id);

      res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          _id: user._id,
          employeeId: user.employeeId,
          email: user.email,
          role: user.role,
          fullName: profile.fullName
        }
      });
    } catch (error) {
      console.error("❌ Registration error:", error.message);
      res.status(500).json({ message: error.message || "Server error during registration" });
    }
  }
);

router.post(
  "/login",
  [
    body("email").isEmail(),
    body("password").notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      if (!user.isVerified) {
        return res.status(403).json({ message: "Please verify your email first" });
      }

      const token = generateToken(user._id);

      res.json({
        message: "Login successful",
        token,
        user: {
          _id: user._id,
          employeeId: user.employeeId,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error during login" });
    }
  }
);

router.get("/me", async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      employeeId: user.employeeId,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
