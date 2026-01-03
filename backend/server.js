const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to database
const connectDB = require("./config/database");
connectDB().then(() => {
  console.log("✅ MongoDB connected successfully!");
}).catch(err => {
  console.error("❌ MongoDB connection error:", err.message);
});

const authMiddleware = require("./middleware/auth");

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/employees", authMiddleware, require("./routes/employees"));
app.use("/api/attendance", authMiddleware, require("./routes/attendance"));
app.use("/api/leaves", authMiddleware, require("./routes/leaves"));
app.use("/api/salary", authMiddleware, require("./routes/salary"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ message: "Backend is running" });
});

// Error handling
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  } else {
    console.error("❌ Server error:", err);
  }
  process.exit(1);
});
